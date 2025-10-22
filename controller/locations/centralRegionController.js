import CentralRegion from "../../models/centralRegionModel.js";

// ✅ Create CentralRegion
export const createCentralRegion = async (req, res) => {
  try {
    const {
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    } = req.body;

    // Cari data terakhir untuk generate ID baru
    const lastData = await CentralRegion.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "CENTRAL001"; // default pertama kali
    if (lastData && lastData.id_central_region) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(
        lastData.id_central_region.replace("CENTRAL", "")
      );
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `CENTRAL${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newCentralRegion = await CentralRegion.create({
      id_central_region: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Central Region berhasil dibuat",
      data: newCentralRegion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All CentralRegion
export const getAllCentralRegion = async (req, res) => {
  try {
    const data = await CentralRegion.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Central Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get CentralRegion by ID
export const getCentralRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CentralRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Central Region tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Central Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update CentralRegion
export const updateCentralRegion = async (req, res) => {
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

    const data = await CentralRegion.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Central Region tidak ditemukan" });
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
      message: "Central Region berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete CentralRegion
export const deleteCentralRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CentralRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Central Region tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Central Region berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
