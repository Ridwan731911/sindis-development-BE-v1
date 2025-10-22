import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import ShipPosition from "../models/shipPositionModel.js";
import ShipRequest from "../models/shipRequestModel.js";
import CaptainShip from "../models/captainShipModel.js";

dotenv.config();

const API_URL = "https://api.scu.co.id/vtms/oses/position?mmsi=all";
const BEARER_TOKEN = process.env.SHIP_API_TOKEN;

const requestPayload = {
  start_date: "2025-06-21",
  end_date: "2025-06-21",
  vessel_name: "ALL",
};

// Konfigurasi
const targetMMSI = ["525003414", "525010344"];
export const getCaptainShipData = async () => {
  if (!BEARER_TOKEN) return;

  try {
    const response = await axios.post(
      API_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const ships = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    const filteredShips = ships.filter((s) =>
      targetMMSI.includes(String(s.MMSI))
    );

    if (!filteredShips.length) {
      console.log("Tidak ada kapal target di API response.");
      return;
    }

    for (const ship of filteredShips) {
      const existing = await CaptainShip.findOne({
        where: { id_captain_ship: ship.MMSI },
      });

      if (existing) {
        // Update data lama (tanpa ubah email/password)
        await existing.update({
          name: ship.name || "",
          latitude: ship.lat ? String(ship.lat) : null,
          longitude: ship.lon ? String(ship.lon) : null,
          latitude_decimal: ship.lat || 0,
          longitude_decimal: ship.lon || 0,
          status: "active",
          updatedAt: new Date(),
        });
      } else {
        // === Buat akun baru untuk kapal ===
        const cleanName = (ship.name || "unknown")
          .replace(/\s+/g, "")
          .toLowerCase();
        const email = cleanName; // tanpa @ship.com
        const plainPassword = cleanName;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        await CaptainShip.create({
          id_captain_ship: ship.MMSI,
          name: ship.name || "",
          latitude: ship.lat ? String(ship.lat) : null,
          longitude: ship.lon ? String(ship.lon) : null,
          latitude_decimal: ship.lat || 0,
          longitude_decimal: ship.lon || 0,
          status: "active",
          role: "captain",
          email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(
          `CaptainShip baru dibuat untuk kapal: ${ship.name}, email: ${email}, password: ${plainPassword}`
        );
      }
    }
  } catch (error) {
    console.error("Gagal menyimpan data CaptainShip:", error.message);
  }
};


export const saveAllShipPositions = async () => {
  if (!BEARER_TOKEN) {
    console.error("API token tidak tersedia di server");
    return;
  }

  try {
    const response = await axios.post(API_URL, requestPayload, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const ships = response.data?.data || [];

    if (!ships.length) {
      console.log("Tidak ada data kapal di API response.");
      return;
    }

    for (const ship of ships) {
      const existing = await ShipPosition.findOne({
        where: { mmsi: ship.MMSI },
      });

      if (!existing) {
        // Bersihkan nama untuk jadi email & password (hapus spasi, lowercase)
        const cleanName = (ship.name || "unknown").replace(/\s+/g, "").toLowerCase();
        const email = cleanName; // langsung pakai nama kapal
        const plainPassword = cleanName; // password = nama kapal (tanpa spasi, lowercase)
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Insert kapal baru ke ShipPosition
        await ShipPosition.create({
          mmsi: ship.MMSI,
          name: ship.name || "",
          lat: ship.lat || 0,
          lon: ship.lon || 0,
          speed: ship.speed || 0,
          heading: ship.heading || 0,
          port: ship.port || "",
          date: ship.date ? new Date(ship.date) : new Date(),
          email,
          password: hashedPassword,
          role: "user",
        });

        console.log(`Ship baru dibuat: ${ship.name}, email: ${email}, password: ${plainPassword}`);
      } else {
        // Update kapal lama (hanya data tertentu)
        await existing.update({
          lat: ship.lat || existing.lat,
          lon: ship.lon || existing.lon,
          speed: ship.speed || existing.speed,
          heading: ship.heading || existing.heading,
          port: ship.port || existing.port,
        });
      }
    }

    // console.log(
    //   `[${new Date().toISOString()}] ${ships.length} kapal berhasil diproses (insert/update).`
    // );
  } catch (error) {
    console.error("Gagal menyimpan data kapal:", error.message);
  }
};

export const getShipData = async (req, res) => {
  if (!BEARER_TOKEN) {
    return res
      .status(500)
      .json({ error: "API token tidak tersedia di server" });
  }

  try {
    const response = await axios.post(API_URL, requestPayload, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        error: "Gagal dari API eksternal",
        message: error.response.data || "Tidak ada detail",
      });
    } else {
      return res.status(500).json({
        error: "Gagal mengambil data kapal dari API eksternal",
        message: error.message,
      });
    }
  }
};

export const saveShipInternal = async () => {
  if (!BEARER_TOKEN) return;

  try {
    const response = await axios.post(API_URL, requestPayload, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const ships = response.data?.data;
    const targetMMSI = "525019672";
    const ship = ships.find((s) => s.MMSI === targetMMSI);

    if (!ship) return;

    const existing = await ShipPosition.findOne({
      where: { mmsi: ship.MMSI, date: ship.date },
    });

    if (existing) return;

    await ShipPosition.create({
      mmsi: ship.MMSI,
      name: ship.name,
      lat: ship.lat,
      lon: ship.lon,
      speed: ship.speed,
      heading: ship.heading,
      port: ship.port,
      date: ship.date,
    });

    // console.log(`[${new Date().toISOString()}] Data kapal berhasil disimpan`);
  } catch (error) {
    console.error("Gagal menyimpan data kapal:", error.message);
  }
};

export const saveOneShipToDatabase = async (req, res) => {
  try {
    await saveShipInternal();
    // res.status(201).json({ message: "Data kapal berhasil disimpan" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal menyimpan data kapal", message: error.message });
  }
};

export const getOneShipFromDatabase = async (req, res) => {
  try {
    const { name } = req.query;
    const ships = await ShipPosition.findAll(name ? { where: { name } } : {});
    res.status(200).json(ships);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data dari database lokal" });
  }
};

export const getApprovedRequests = async (req, res) => {
  try {
    const approvedRequests = await ShipRequest.findAll({
      where: {
        status_request: ["approved", "approved with note", "process to fleet team"],
        fleet_status: ["pending", "process"], // hanya tampilkan pending & approved
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error("Error getApprovedRequests:", error);
    res.status(500).json({
      message:
        "Gagal mengambil data request yang approved dan fleet_status pending/approved",
    });
  }
};

export const getCaptainShips = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: ?status=active/inactive

    const whereClause = status ? { status } : {};

    const captains = await CaptainShip.findAll({
      where: whereClause,
      order: [["name", "ASC"]], // urut berdasarkan nama kapal
    });

    res.status(200).json(captains);
  } catch (error) {
    console.error("Gagal mengambil data kapten kapal:", error);
    res.status(500).json({
      message: "Gagal mengambil data kapten kapal",
      error: error.message,
    });
  }
};

export const getFleetHistory = async (req, res) => {
  try {
    const historyRequests = await ShipRequest.findAll({
      where: {
        fleet_status: "complete", // hanya yang complete
      },
      order: [["updatedAt", "DESC"]], // urut dari terbaru
    });

    res.status(200).json(historyRequests);
  } catch (error) {
    console.error("Error getFleetHistory:", error);
    res.status(500).json({
      message: "Gagal mengambil data history fleet yang complete",
    });
  }
};

export const updateFleetStatus = async (req, res) => {
  try {
    const { id } = req.params; // ship_request_id dari URL
    const { fleet_status, status_request } = req.body; // bisa kirim dua status

    if (!fleet_status && !status_request) {
      return res.status(400).json({ msg: "Minimal salah satu status harus diisi" });
    }

    // Cari data berdasarkan ship_request_id
    const request = await ShipRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ msg: "Request tidak ditemukan" });
    }

    // Update field sesuai yang dikirim
    if (fleet_status) request.fleet_status = fleet_status;
    if (status_request) request.status_request = status_request;

    await request.save();

    res.status(200).json({
      msg: `Status berhasil diperbarui`,
      id: request.ship_request_id,
      fleet_status: request.fleet_status,
      status_request: request.status_request,
    });
  } catch (error) {
    console.error("Error updateFleetStatus:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


export const updatePriorityLevel = async (req, res) => {
  const { id } = req.params;
  const { priority_level } = req.body;

  if (!["normal", "urgent", "emergency"].includes(priority_level)) {
    return res.status(400).json({ message: "Invalid priority level" });
  }

  try {
    const request = await ShipRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.priority_level = priority_level;
    await request.save();

    res.json({ message: "Priority level updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
