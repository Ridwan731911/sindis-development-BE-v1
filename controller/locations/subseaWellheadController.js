import SubseaWellhead from "../../models/subseaWellheadModel.js";

// ✅ Create SubseaWellhead
export const createSubseaWellhead = async (req, res) => {
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
    const lastData = await SubseaWellhead.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "WELLHEAD001"; // default pertama kali
    if (lastData && lastData.id_subsea_wellhead) {
      const lastNumber = parseInt(
        lastData.id_subsea_wellhead.replace("WELLHEAD", "")
      );
      const nextNumber = lastNumber + 1;
      newId = `SUBSEA${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newSubseaWellhead = await SubseaWellhead.create({
      id_subsea_wellhead: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Subsea Wellhead berhasil dibuat",
      data: newSubseaWellhead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All SubseaWellhead
export const getAllSubseaWellhead = async (req, res) => {
  try {
    const data = await SubseaWellhead.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Subsea Wellhead",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get SubseaWellhead by ID
export const getSubseaWellheadById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SubseaWellhead.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Subsea Wellhead tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Subsea Wellhead",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update SubseaWellhead
export const updateSubseaWellhead = async (req, res) => {
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

    const data = await SubseaWellhead.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Subsea Wellhead tidak ditemukan" });
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
      message: "Subsea Wellhead berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete SubseaWellhead
export const deleteSubseaWellhead = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SubseaWellhead.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Subsea Wellhead tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Subsea Wellhead berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
