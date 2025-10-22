import Fuel from "../models/fuelModel.js";
import { Op } from "sequelize";
import ShipRequest from "../models/shipRequestModel.js";

// ✅ Create Fuel
export const createFuel = async (req, res) => {
  try {
    const {
      type_fuel,
      material_fuel,
      volume_tersedia_fuel,
      satuan_ukur_fuel,
      status_fuel,
    } = req.body;

    // Ambil data terakhir untuk generate ID baru
    const lastData = await Fuel.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "FUEL001"; // default pertama kali
    if (lastData && lastData.fuel_id) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.fuel_id.replace("FUEL", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `FUEL${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newFuel = await Fuel.create({
      fuel_id: newId,
      type_fuel,
      material_fuel,
      volume_tersedia_fuel,
      satuan_ukur_fuel,
      status_fuel,
    });

    res.status(201).json({
      message: "Fuel berhasil dibuat",
      data: newFuel,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get All Fuel
export const getAllFuel = async (req, res) => {
  try {
    const data = await Fuel.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Fuel",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get Fuel by ID
export const getFuelById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fuel.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Fuel tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Detail Fuel",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Update Fuel
export const updateFuel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type_fuel,
      material_fuel,
      volume_tersedia_fuel,
      satuan_ukur_fuel,
      status_fuel,
    } = req.body;

    const data = await Fuel.findByPk(id);
    if (!data) {
      return res.status(404).json({
        message: "Fuel tidak ditemukan",
      });
    }

    await data.update({
      type_fuel,
      material_fuel,
      volume_tersedia_fuel,
      satuan_ukur_fuel,
      status_fuel,
    });

    res.status(200).json({
      message: "Fuel berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Delete Fuel
export const deleteFuel = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fuel.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Fuel tidak ditemukan",
      });
    }

    await data.destroy();
    res.status(200).json({
      message: "Fuel berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFuelRequests = async (req, res) => {
  try {
    const fuelRequests = await ShipRequest.findAll({
      where: {
        kategori_request: "fuel",
        status_request: "waiting approval"
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(fuelRequests);
  } catch (error) {
    console.error("Error getFuelRequests:", error);
    res.status(500).json({ message: "Gagal mengambil data fuel request" });
  }
};

export const ApproveFuelRequests = async (req, res) => {
  try {
    const fuelRequests = await ShipRequest.findAll({
      where: {
        kategori_request: "fuel",
        status_request: "waiting approval"
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(fuelRequests);
  } catch (error) {
    console.error("Error getFuelRequests:", error);
    res.status(500).json({ message: "Gagal mengambil data fuel request" });
  }
};

export const getFuelRequestHistory = async (req, res) => {
  try {
    const fuelRequests = await ShipRequest.findAll({
      where: {
        kategori_request: "fuel",
        status_request: {
          [Op.in]: ["approved", "approved with note", "rejected"] // filter multiple status
        }
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(fuelRequests);
  } catch (error) {
    console.error("Error getFuelRequestHistory:", error);
    res.status(500).json({ message: "Gagal mengambil history fuel request" });
  }
};

export const updateFuelRequest = async (req, res) => {
  try {
    const { ship_request_id } = req.params;

    console.log("Update fuel request:", ship_request_id, req.body);

    const [updated] = await ShipRequest.update(req.body, {
      where: { ship_request_id },
    });

    if (updated === 0) {
      return res.status(404).json({ msg: "Fuel request not found" });
    }

    res.json({ msg: "Fuel request updated successfully" });
  } catch (error) {
    console.error("UpdateFuelRequest error:", error);
    res.status(500).json({ msg: error.message });
  }
};
