import SouthRegion from "../../models/southRegionModel.js";

// ✅ Create SouthRegion
export const createSouthRegion = async (req, res) => {
  try {
    const {
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    } = req.body;

    // Ambil data terakhir untuk generate ID baru
    const lastData = await SouthRegion.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "SOUTH001"; // default pertama kali
    if (lastData && lastData.id_south_region) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.id_south_region.replace("SOUTH", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `SOUTH${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newSouthRegion = await SouthRegion.create({
      id_south_region: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "South Region berhasil dibuat",
      data: newSouthRegion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All SouthRegion
export const getAllSouthRegion = async (req, res) => {
  try {
    const data = await SouthRegion.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar South Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get SouthRegion by ID
export const getSouthRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SouthRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "South Region tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail South Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update SouthRegion
export const updateSouthRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    } = req.body;

    const data = await SouthRegion.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "South Region tidak ditemukan" });
    }

    await data.update({
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(200).json({
      message: "South Region berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete SouthRegion
export const deleteSouthRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SouthRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "South Region tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "South Region berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
