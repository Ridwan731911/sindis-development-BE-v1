import NorthRegion from "../../models/northRegionModel.js";

// ✅ Create NorthRegion
export const createNorthRegion = async (req, res) => {
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
    const lastData = await NorthRegion.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "NORTH001"; // default pertama kali
    if (lastData && lastData.id_north_region) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.id_north_region.replace("NORTH", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `NORTH${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newNorthRegion = await NorthRegion.create({
      id_north_region: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "North Region berhasil dibuat"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All NorthRegion
export const getAllNorthRegion = async (req, res) => {
  try {
    const data = await NorthRegion.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar North Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get NorthRegion by ID
export const getNorthRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await NorthRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "North Region tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail North Region",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update NorthRegion
export const updateNorthRegion = async (req, res) => {
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

    const data = await NorthRegion.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "North Region tidak ditemukan" });
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
      message: "North Region berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete NorthRegion
export const deleteNorthRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await NorthRegion.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "North Region tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "North Region berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
