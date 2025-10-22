import ShipRequest from "../../models/shipRequestModel.js";
import Users from "../../models/userModel.js";
import CaptainShip from "../../models/captainShipModel.js";
import ShipPosition from "../../models/shipPositionModel.js";
import {
    Op
} from "sequelize";

//card dashboard ada 4
export const getDashboardCards = async (req, res) => {
    try {
        // Jalankan semua query paralel (lebih cepat)
        const [
            totalRequests,
            totalUsers,
            totalCaptain,
            totalPositions,
            pendingRequests,
            completedRequests
        ] = await Promise.all([
            ShipRequest.count(),
            Users.count(),
            CaptainShip.count(),
            ShipPosition.count(),
            ShipRequest.count({
                where: {
                    status_request: "waiting approval"
                }
            }),
            ShipRequest.count({
                where: {
                    fleet_status: "complete"
                }
            }),
        ]);

        // Total user gabungan
        const totalAllUsers = totalUsers + totalCaptain + totalPositions;

        res.status(200).json({
            totalRequests,
            totalUsers: totalAllUsers,
            pendingRequests,
            completedRequests
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data dashboard",
            error: error.message
        });
    }
};

//1. Bar chart Bar Chart — Jumlah Request per Kategori
export const getRequestByCategory = async (req, res) => {
  try {
    // Ambil semua request (hanya kolom kategori)
    const requests = await ShipRequest.findAll({
      attributes: ["kategori_request"],
    });

    //  Siapkan kategori yang ingin dihitung
    const categories = [
      "fuel",
      "fresh_water",
      "passenger",
      "material",
      "foodstuff",
    ];

    // Hitung jumlah per kategori
    const counts = categories.map((cat) => ({
      category: cat,
      total: requests.filter((r) => r.kategori_request === cat).length,
    }));

    //  Kirim respons
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data jumlah request per kategori",
      data: counts,
    });
  } catch (error) {
    console.error("Error getRequestByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data request per kategori",
      error: error.message,
    });
  }
};
//2. Pie-chart Pie Chart — Jumlah Request per Status
export const getRequestByStatus = async (req, res) => {
  try {
    // 1️⃣ Ambil semua request tapi cuma ambil kolom status_request biar ringan
    const requests = await ShipRequest.findAll({
      attributes: ["status_request"],
    });

    // 2️⃣ Daftar status yang mungkin ada di tabel
    const statuses = [
      "waiting approval",
      "process to fleet team",
      "approved",
      "rejected",
    ];

    // 3️⃣ Hitung jumlah per status
    const counts = statuses.map((status) => ({
      status,
      total: requests.filter((r) => r.status_request === status).length,
    }));

    // 4️⃣ Kirim respons ke frontend
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data jumlah request per status",
      data: counts,
    });
  } catch (error) {
    console.error("Error getRequestByStatus:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data request per status",
      error: error.message,
    });
  }
};