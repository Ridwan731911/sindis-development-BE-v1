import Conductor from "../../models/conductorModel.js";

// ✅ Create Conductor
export const createConductor = async (req, res) => {
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
    const lastData = await Conductor.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "CONDUCT001"; // default pertama kali
    if (lastData && lastData.id_conductor) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.id_conductor.replace("CONDUCT", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `CONDUCT${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newConductor = await Conductor.create({
      id_conductor: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Conductor berhasil dibuat",
      data: newConductor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Conductor
export const getAllConductor = async (req, res) => {
  try {
    const data = await Conductor.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Conductor",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Conductor by ID
export const getConductorById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Conductor.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Conductor tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Conductor",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Conductor
export const updateConductor = async (req, res) => {
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

    const data = await Conductor.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Conductor tidak ditemukan" });
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
      message: "Conductor berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Conductor
export const deleteConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Conductor.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Conductor tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Conductor berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
