import Passenger from "../models/passengerModel.js";
import ShipRequest from "../models/shipRequestModel.js";

// ✅ Create Passenger
export const createPassenger = async (req, res) => {
  try {
    const { type_Passenger, jumlah_Passenger_tesedia, status_Passenger } =
      req.body;

    // Ambil data terakhir untuk generate ID baru
    const lastData = await Passenger.findOne({
      order: [["createdAt", "DESC"]],
    });

    let newId = "PASS001"; // default pertama kali
    if (lastData && lastData.Passenger_id) {
      // Ambil angka dari ID terakhir
      const lastNumber = parseInt(lastData.Passenger_id.replace("PASS", ""));
      const nextNumber = lastNumber + 1;

      // Format ke 3 digit (001, 002, dst.)
      newId = `PASS${nextNumber.toString().padStart(3, "0")}`;
    }

    // Simpan ke database
    const newPassenger = await Passenger.create({
      Passenger_id: newId,
      type_Passenger,
      jumlah_Passenger_tesedia,
      status_Passenger,
    });

    res.status(201).json({
      message: "Passenger berhasil dibuat",
      data: newPassenger,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get All Passenger
export const getAllPassenger = async (req, res) => {
  try {
    const data = await Passenger.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Daftar Passenger",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get Passenger by ID
export const getPassengerById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Passenger.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Passenger tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Detail Passenger",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Update Passenger
export const updatePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const { type_Passenger, jumlah_Passenger_tesedia, status_Passenger } =
      req.body;

    const data = await Passenger.findByPk(id);
    if (!data) {
      return res.status(404).json({
        message: "Passenger tidak ditemukan",
      });
    }

    await data.update({
      type_Passenger,
      jumlah_Passenger_tesedia,
      status_Passenger,
    });

    res.status(200).json({
      message: "Passenger berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Delete Passenger
export const deletePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Passenger.findByPk(id);

    if (!data) {
      return res.status(404).json({
        message: "Passenger tidak ditemukan",
      });
    }

    await data.destroy();
    res.status(200).json({
      message: "Passenger berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getpassengerRequests = async (req, res) => {
  try {
    const passengerRequests = await ShipRequest.findAll({
      where: { kategori_request: "passenger" },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(passengerRequests);
  } catch (error) {
    console.error("Error getPassengerRequests:", error);
    res.status(500).json({ message: "Gagal mengambil data passenger request" });
  }
};

export const updatePassengerRequest = async (req, res) => {
  try {
    const { ship_request_id } = req.params;

    console.log("Update passenger request:", ship_request_id, req.body);

    const [updated] = await ShipRequest.update(req.body, {
      where: { ship_request_id },
    });

    if (updated === 0) {
      return res.status(404).json({ msg: "Passenger request not found" });
    }

    res.json({ msg: "Passenger request updated successfully" });
  } catch (error) {
    console.error("UpdatePassengerRequest error:", error);
    res.status(500).json({ msg: error.message });
  }
};
