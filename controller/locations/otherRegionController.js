import OtherRegion from "../../models/otherRegionModel.js";

// ✅ Create OtherRegion
export const createOtherRegion = async (req, res) => {
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
    const lastData = await OtherRegion.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "OTH001"; // default pertama kali
    if (lastData && lastData.id_other_region) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(
        lastData.id_other_region.replace("OTH", "")
      );
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `OTH${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newOtherRegion = await OtherRegion.create({
      id_other_region: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Other Region berhasil dibuat",
      data: newOtherRegion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All OtherRegion
export const getAllOtherRegion = async (req, res) => {
  try {
    const data = await OtherRegion.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Other Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get OtherRegion by ID
export const getOtherRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await OtherRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Other Region tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Other Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update OtherRegion
export const updateOtherRegion = async (req, res) => {
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

    const data = await OtherRegion.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Other Region tidak ditemukan" });
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
      message: "Other Region berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete OtherRegion
export const deleteOtherRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await OtherRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Other Region tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Other Region berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
