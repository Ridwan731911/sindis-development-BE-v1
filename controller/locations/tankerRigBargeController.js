import TankerRigBarge from "../../models/tankerRigBargeModel.js";

// ✅ Create TankerRigBarge
export const createTankerRigBarge = async (req, res) => {
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
    const lastData = await TankerRigBarge.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "TRB001"; // default pertama kali
    if (lastData && lastData.id_tanker_rig_barge) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(
        lastData.id_tanker_rig_barge.replace("TRB", "")
      );
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `TRB${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newTankerRigBarge = await TankerRigBarge.create({
      id_tanker_rig_barge: newId,
      platform_name,
      latitude,
      longitude,
      latitude_decimal,
      longitude_decimal,
      status,
    });

    res.status(201).json({
      message: "Tanker Rig Barge berhasil dibuat",
      data: newTankerRigBarge,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All TankerRigBarge
export const getAllTankerRigBarge = async (req, res) => {
  try {
    const data = await TankerRigBarge.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Tanker Rig Barge",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get TankerRigBarge by ID
export const getTankerRigBargeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TankerRigBarge.findByPk(id);

    if (!data) {
      return res
        .status(404)
        .json({ message: "Tanker Rig Barge tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail Tanker Rig Barge",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update TankerRigBarge
export const updateTankerRigBarge = async (req, res) => {
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

    const data = await TankerRigBarge.findByPk(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Tanker Rig Barge tidak ditemukan" });
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
      message: "Tanker Rig Barge berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete TankerRigBarge
export const deleteTankerRigBarge = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TankerRigBarge.findByPk(id);

    if (!data) {
      return res
        .status(404)
        .json({ message: "Tanker Rig Barge tidak ditemukan" });
    }

    await data.destroy();
    res.status(200).json({ message: "Tanker Rig Barge berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
