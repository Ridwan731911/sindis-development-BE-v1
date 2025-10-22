// controllers/ruteDestinasiController.js
import RuteDestinasi from "../models/ruteDestinasiModel.js";

export const createRuteDestinasi = async (req, res) => {
  try {
    const newRute = await RuteDestinasi.create(req.body);
    res.status(201).json(newRute);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal menyimpan rute", error });
  }
};
