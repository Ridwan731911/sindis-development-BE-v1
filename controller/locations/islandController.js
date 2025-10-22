import Island from "../../models/islandModel.js";
// ✅ Create Island
export const createIsland = async (req, res) => {
  try {
    const {
      island_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    } = req.body;

    // Ambil data terakhir untuk generate ID baru
    const lastData = await Island.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "ISLAND001"; // default pertama kali
    if (lastData && lastData.id_Island) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.id_Island.replace("ISLAND", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `ISLAND${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newIsland = await Island.create({
      id_island: newId,
      island_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Island berhasil dibuat",
      data: newIsland,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Island
export const getAllIsland = async (req, res) => {
  try {
    const data = await Island.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Island",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Island by ID
export const getIslandById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Island.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Island tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Island",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Island
export const updateIsland = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      island_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    } = req.body;

    const data = await Island.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Island tidak ditemukan" });
    }

    await data.update({
      island_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(200).json({
      message: "Island berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Island
export const deleteIsland = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Island.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Island tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Island berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
