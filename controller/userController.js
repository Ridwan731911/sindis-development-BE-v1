import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import ShipRequest from "../models/shipRequestModel.js";
import CaptainShip from "../models/captainShipModel.js";
import ShipPosition from "../models/shipPositionModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};
export const getProfile = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    res.json({
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role,
    });
  });
};

export const updateProfilUsers = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.update({ image });
    res.json({ msg: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const updateUsers = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  const userExists = await Users.findOne({ where: { email: email } });
  if (userExists) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      await Users.update(
        {
          password: hashPassword,
        },
        {
          where: { email: email },
        }
      );

      res.json({ msg: "Ubah Password Berhasil" });
    } catch (error) {
      console.log(error);
      res.status(500).json;
    }
  } else {
    res.status(404).json({ msg: "Email tidak terdaftar" });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // validasi password
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirm password do not match" });
  }

  // daftar role yang diperbolehkan
  const allowedRoles = [
    "admin",
    "fuel",
    "fw",
    "passenger",
    "fleet",
    "spv",
    "user",
  ];

  // validasi role (jika dikirim)
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  try {
    // cek email sudah dipakai atau belum
    const userExists = await Users.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(409).json({ msg: "Email is already in use" });
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // simpan user
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role || "user", // default "user" jika tidak dikirim
    });

    res.status(201).json({ msg: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const Login = async (req, res) => {
  try {
    let user = null;
    let source = null;

    // 1. Cek di Users
    user = await Users.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      source = "Users";
    }

    // 2. Kalau tidak ada di Users, cek CaptainShip
    if (!user) {
      user = await CaptainShip.findOne({
        where: { email: req.body.email },
      });
      if (user) source = "CaptainShip";
    }

    // 3. Kalau tidak ada juga, cek ShipPosition
    if (!user) {
      user = await ShipPosition.findOne({
        where: { email: req.body.email },
      });
      if (user) source = "ShipPosition";
    }

    // Kalau masih null, berarti email tidak ditemukan
    if (!user) {
      console.log("Login gagal: email tidak ditemukan");
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }

    // Debug log
    console.log("Login attempt:");
    console.log("Source table:", source);
    console.log("Email input :", req.body.email);
    console.log("Password input :", req.body.password);
    console.log("Password hash DB:", user.password);

    // Cek password
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log("Password match?", match);

    if (!match) {
      console.log("Login gagal: password salah");
      return res.status(400).json({ msg: "Password salah" });
    }

    // Ambil data penting user
    const userId =
      user.id ||
      user.id_captain_ship ||
      user.ship_position_id; // support 3 tabel
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const lat =
      user.latitude || user.lat || null;
    const lng =
      user.longitude || user.lon || null;
    const type = user.type || null;

    // Buat token
    const accessToken = jwt.sign(
      { userId, name, email, role, source },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId, name, email, role, source },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Simpan refresh token di tabel sesuai asal user
    if (source === "Users") {
      await Users.update(
        { refresh_token: refreshToken },
        { where: { id: userId } }
      );
    } else if (source === "CaptainShip") {
      await CaptainShip.update(
        { refresh_token: refreshToken },
        { where: { id_captain_ship: userId } }
      );
    } else if (source === "ShipPosition") {
      await ShipPosition.update(
        { refresh_token: refreshToken },
        { where: { ship_position_id: userId } }
      );
    }

    // Kirim refresh token via cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // ubah ke true kalau pakai https
    });

    // Response ke frontend
    console.log("Login berhasil dari:", source, "->", email);
    res.json({
      accessToken,
      user: {
        id: userId,
        name,
        email,
        role,
        lat,
        lng,
        type,
        source,
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204); // tidak ada token, sudah dianggap logout
    }

    // cari user berdasarkan refresh_token
    const user = await Users.findOne({
      where: { refresh_token: refreshToken }, // pastikan nama kolom sesuai DB
    });

    if (!user) {
      return res.sendStatus(204); // user tidak ditemukan
    }

    // update refresh_token menjadi null
    const [updated] = await Users.update(
      { refresh_token: null },
      { where: { id: user.id } }
    );

    if (updated === 0) {
      console.warn("Logout gagal: tidak ada row terupdate");
    } else {
      console.log(`Logout berhasil: refresh_token user ${user.id} dihapus`);
    }

    // hapus cookie di browser
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(200);
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ msg: "Logout gagal", error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Error during user creation:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    await Users.update(
      { name, email, role },
      {
        where: { id },
      }
    );
    res.json({ msg: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await Users.destroy({
      where: { id },
    });
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const createUserRequest = async (req, res) => {
  try {
    const {
      ship_request_id,
      ship_position_id,
      tanggal_request,
      kordinat_request,
      lat_request,
      lng_request,
      kategori_request,
      name,
      email,
      jenis_material,
      kuantitas,
      satuan,
      priority_request,
      fleet_status,
      destination_name
    } = req.body;

    if (
      !ship_request_id ||
      !name ||
      !kuantitas ||
      !satuan ||
      !kordinat_request ||
      !lat_request ||
      !lng_request
    ) {
      return res.status(400).json({ msg: "Data tidak lengkap" });
    }

    const newRequest = await ShipRequest.create({
      ship_request_id,
      ship_position_id: ship_position_id || null,
      tanggal_request: tanggal_request || new Date(),
      kordinat_request,
      fleet_status,
      lat_request,
      lng_request,
      kategori_request: kategori_request,
      name,
      email: email || null,
      jenis_material: jenis_material || null,
      kuantitas,
      satuan,
      priority_request,
      destination_name
    });

    res
      .status(201)
      .json({ msg: "Data berhasil disimpan", id: newRequest.ship_request_id });
  } catch (error) {
    console.error("Error createUserRequest:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// Ambil semua request berdasarkan email user
export const getUserRequests = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ msg: "Email wajib disertakan" });
    }

    // Ambil semua data, bukan hanya 1
    const requests = await ShipRequest.findAll({
      where: { email },
      order: [["createdAt", "DESC"]], // urutkan dari terbaru
      raw: true,
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error getUserRequests:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

