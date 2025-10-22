import FreshWater from "../models/freshWaterModel.js";
import ShipRequest from "../models/shipRequestModel.js";

// ✅ Create FreshWater
export const createFreshWater = async (req, res) => {
  try {
    const {
      volume_tersedia_fresh_water,
      satuan_ukur_fresh_water,
      status_fresh_water,
    } = req.body;

    // Ambil data terakhir untuk generate ID baru
    const lastData = await FreshWater.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "FW001"; // default pertama kali
    if (lastData && lastData.fresh_water_id) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.fresh_water_id.replace("FW", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `FW${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newFreshWater = await FreshWater.create({
      fresh_water_id: newId,
      volume_tersedia_fresh_water,
      satuan_ukur_fresh_water,
      status_fresh_water,
    });

    res.status(201).json({
      message: "Fresh Water berhasil dibuat",
      data: newFreshWater,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get All FreshWater
export const getAllFreshWater = async (req, res) => {
  try {
    const data = await FreshWater.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Fresh Water",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get FreshWater by ID
export const getFreshWaterById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await FreshWater.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Fresh Water tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Detail Fresh Water",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Update FreshWater
export const updateFreshWater = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      volume_tersedia_fresh_water,
      satuan_ukur_fresh_water,
      status_fresh_water,
    } = req.body;

    const data = await FreshWater.findByPk(id);
    if (!data) {
      return res.status(404).json({
        message: "Fresh Water tidak ditemukan",
      });
    }

    await data.update({
      volume_tersedia_fresh_water,
      satuan_ukur_fresh_water,
      status_fresh_water,
    });

    res.status(200).json({
      message: "Fresh Water berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Delete FreshWater
export const deleteFreshWater = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await FreshWater.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Fresh Water tidak ditemukan",
      });
    }

    await data.destroy();
    res.status(200).json({
      message: "Fresh Water berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getfwRequests = async (req, res) => {
  try {
    const fwRequests = await ShipRequest.findAll({
      where: { kategori_request: "fresh_water" },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(fwRequests);
  } catch (error) {
    console.error("Error getFreshWaterRequests:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data fresh water request" });
  }
};

export const updateFwRequest = async (req, res) => {
  try {
    const { ship_request_id } = req.params;

    console.log("Update fresh water request:", ship_request_id, req.body);

    const [updated] = await ShipRequest.update(req.body, {
      where: { ship_request_id },
    });

    if (updated === 0) {
      return res.status(404).json({ msg: "Fresh Water request not found" });
    }

    res.json({ msg: "Fresh Water request updated successfully" });
  } catch (error) {
    console.error("UpdateFreshWaterRequest error:", error);
    res.status(500).json({ msg: error.message });
  }
};
