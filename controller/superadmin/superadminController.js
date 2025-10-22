// controllers/superAdminController.js
import bcrypt from "bcrypt";
import Users from "../../models/userModel.js";
import CaptainShip from "../../models/captainShipModel.js";
import ShipPosition from "../../models/shipPositionModel.js";
const SALT_ROUNDS = 10;
export const getAllUsersSuperAdmin = async (req, res) => {
  try {
    // Ambil dari Users
    const users = await Users.findAll({
      attributes: ["name", "role", "email", "password"],
    });

    // Ambil dari CaptainShip
    const captains = await CaptainShip.findAll({
      attributes: ["name", "role", "email", "password"],
    });

    // Ambil dari ShipPosition
    const shipPositions = await ShipPosition.findAll({
      attributes: ["name", "role", "email", "password"],
    });

    // Gabungkan semua data
    const allUsers = [
      ...users.map((u) => ({ ...u.dataValues, source: "users" })),
      ...captains.map((c) => ({ ...c.dataValues, source: "captain_ship" })),
      ...shipPositions.map((s) => ({ ...s.dataValues, source: "ship_positions" })),
    ];

    // Tambahkan nomor urut (No)
    const allUsersWithNo = allUsers.map((item, index) => ({
      No: index + 1,
      ...item,
    }));

    res.status(200).json(allUsersWithNo);
  } catch (error) {
    console.error("Error fetching all users for superadmin:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const getUserByIdSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;

    // Cek di Users
    user = await Users.findOne({
      where: { id },
      attributes: ["name", "role", "email", "password"],
    });
    if (user) {
      return res.status(200).json({ No: 1, ...user.dataValues, source: "users" });
    }

    // Cek di CaptainShip
    user = await CaptainShip.findOne({
      where: { id_captain_ship: id },
      attributes: ["name", "role", "email", "password"],
    });
    if (user) {
      return res.status(200).json({ No: 1, ...user.dataValues, source: "captain_ship" });
    }

    // Cek di ShipPosition
    user = await ShipPosition.findOne({
      where: { ship_position_id: id },
      attributes: ["name", "role", "email", "password"],
    });
    if (user) {
      return res.status(200).json({ No: 1, ...user.dataValues, source: "ship_positions" });
    }

    // Kalau tidak ditemukan di semua tabel
    return res.status(404).json({ msg: "User not found" });
  } catch (error) {
    console.error("Error fetching user by id for superadmin:", error);
    res.status(500).json({ msg: "Server error occurred" });
  }
};

export const updateUserByIdSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, password } = req.body;

    // helper: hash password jika ada
    const hashPasswordIfProvided = async (pwd, currentPassword) => {
      if (typeof pwd === "undefined") {
        // password tidak dikirim => kembalikan password sekarang (tidak diubah)
        return currentPassword;
      }
      // jika dikirim tapi kosong string => anggap user ingin set password kosong? 
      // Di sini kita anggap jika string kosong atau null maka tidak diubah.
      if (pwd === null || (typeof pwd === "string" && pwd.trim() === "")) {
        return currentPassword;
      }
      // hash dan return
      const hashed = await bcrypt.hash(pwd, SALT_ROUNDS);
      return hashed;
    };

    // 1) Cek di Users (primary key: id)
    let instance = await Users.findOne({ where: { id } });
    if (instance) {
      const currentPassword = instance.password;
      const newPassword = await hashPasswordIfProvided(password, currentPassword);

      // build update payload only with provided fields (except password handled)
      const updatePayload = {};
      if (typeof name !== "undefined") updatePayload.name = name;
      if (typeof role !== "undefined") updatePayload.role = role;
      if (typeof email !== "undefined") updatePayload.email = email;
      // always set password to either new hashed or kept current
      updatePayload.password = newPassword;

      await instance.update(updatePayload);

      return res.status(200).json({
        msg: "User (users) updated",
        source: "users",
        data: {
          name: instance.name,
          role: instance.role,
          email: instance.email,
          password: instance.password,
        },
      });
    }

    // 2) Cek di CaptainShip (primary key: id_captain_ship)
    instance = await CaptainShip.findOne({ where: { id_captain_ship: id } });
    if (instance) {
      const currentPassword = instance.password;
      const newPassword = await hashPasswordIfProvided(password, currentPassword);

      const updatePayload = {};
      if (typeof name !== "undefined") updatePayload.name = name;
      if (typeof role !== "undefined") updatePayload.role = role;
      if (typeof email !== "undefined") updatePayload.email = email;
      updatePayload.password = newPassword;

      await instance.update(updatePayload);

      return res.status(200).json({
        msg: "User (captain_ship) updated",
        source: "captain_ship",
        data: {
          id_captain_ship: instance.id_captain_ship,
          name: instance.name,
          role: instance.role,
          email: instance.email,
          password: instance.password,
        },
      });
    }

    // 3) Cek di ShipPosition (primary key: ship_position_id)
    instance = await ShipPosition.findOne({ where: { ship_position_id: id } });
    if (instance) {
      const currentPassword = instance.password;
      const newPassword = await hashPasswordIfProvided(password, currentPassword);

      const updatePayload = {};
      if (typeof name !== "undefined") updatePayload.name = name;
      if (typeof role !== "undefined") updatePayload.role = role;
      if (typeof email !== "undefined") updatePayload.email = email;
      updatePayload.password = newPassword;

      await instance.update(updatePayload);

      return res.status(200).json({
        msg: "User (ship_positions) updated",
        source: "ship_positions",
        data: {
          ship_position_id: instance.ship_position_id,
          name: instance.name,
          role: instance.role,
          email: instance.email,
          password: instance.password,
        },
      });
    }

    // Tidak ditemukan di semua tabel
    return res.status(404).json({ msg: "User not found in any source" });
  } catch (error) {
    console.error("Error updating user by id for superadmin:", error);
    return res.status(500).json({ msg: "Server error occurred", error: error.message });
  }
};

export const deleteUserByIdSuperAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // 1) Coba hapus dari tabel Users
    const deletedUser = await Users.destroy({
      where: { id },
    });
    if (deletedUser) {
      return res.status(200).json({
        msg: "User deleted successfully from users table",
        source: "users",
      });
    }

    // 2) Coba hapus dari tabel CaptainShip
    const deletedCaptain = await CaptainShip.destroy({
      where: { id_captain_ship: id },
    });
    if (deletedCaptain) {
      return res.status(200).json({
        msg: "User deleted successfully from captain_ship table",
        source: "captain_ship",
      });
    }

    // 3) Coba hapus dari tabel ShipPosition
    const deletedShipPos = await ShipPosition.destroy({
      where: { ship_position_id: id },
    });
    if (deletedShipPos) {
      return res.status(200).json({
        msg: "User deleted successfully from ship_positions table",
        source: "ship_positions",
      });
    }

    // 4) Jika tidak ditemukan di semua tabel
    return res.status(404).json({
      msg: "User not found in any table",
    });
  } catch (error) {
    console.error("Error deleting user (superadmin):", error);
    return res.status(500).json({
      msg: "Server error occurred",
      error: error.message,
    });
  }
};