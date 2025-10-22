import ShipRequest from "../../models/shipRequestModel.js";
import PassengerRequest from "../../models/passengerRequestModel.js";
import ShipPosition from "../../models/shipPositionModel.js";
import Users from "../../models/userModel.js";
import db from "../../config/database.js";


export const getPassangerRequests = async (req, res) => {
    try {
        const requests = await ShipRequest.findAll({
            where: {
                kategori_request: "passenger"
            },
            attributes: [
                "ship_request_id",
                "tanggal_request",
                "kordinat_request",
                "kategori_request",
                "status_request"
            ],
            include: [
                {
                    model: ShipPosition,
                    as: "position",
                    attributes: ["name"]
                },
                {
                    model: Users,
                    as: "user",
                    attributes: ["name", "email"]
                },
                {
                    model: PassengerRequest,
                    as: "passengerRequests",
                    attributes: [
                        "passenger_request_id",
                        "jumlah_passenger",
                        "deskripsi"
                    ]
                }
            ],
            order: [["tanggal_request", "DESC"]],
        });

        // Jika tidak ada data
        if (!requests || requests.length === 0) {
        return res.status(200).json({
            message: "Tidak ada ship request passanger yang ditemukan",
        });
        }

        // Format hasil biar lebih rapi
        const formatted = requests.map((req) => ({
            idRequest: req.ship_request_id,
            tanggal: req.tanggal_request,
            kordinat: req.kordinat_request,
            kategori: req.kategori_request,
            status: req.status_request,
            name: req.position?.name || "-",
            user: {
                nama: req.user?.name || "-",
                email: req.user?.email || "-"
            },
            passenger: req.passengerRequests?.map((p) => ({
                id: p.passenger_request_id,
                jumlah: p.jumlah_passenger,
                deskripsi: p.deskripsi
            }))
        }));

        res.status(200).json({
            message: "Daftar ship request passanger berhasil diambil",
            data: formatted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message,
        });
    }
};

export const getPassangerRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ShipRequest.findOne({
      where: {
        ship_request_id: id,
        kategori_request: "passanger",
      },
      attributes: [
        "ship_request_id",
        "tanggal_request",
        "kordinat_request",
        "kategori_request",
        "status_request",
      ],
      include: [
        {
          model: ShipPosition,
          as: "position",
          attributes: ["name"],
        },
        {
          model: Users,
          as: "user",
          attributes: ["name", "email"],
        },
         {
            model: PassengerRequest,
            as: "passengerRequests",
            attributes: [
                "passenger_request_id",
                "jumlah_passenger",
                "deskripsi"
            ]
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        message: `Ship request passanger dengan id ${id} tidak ditemukan`,
      });
    }
    // Format hasil
    const formatted = {
      idRequest: request.ship_request_id,
      tanggal: request.tanggal_request,
      kordinat: request.kordinat_request,
      kategori: request.kategori_request,
      status: request.status_request,
      name: request.position?.name || "-",
      user: {
        nama: request.user?.name || "-",
        email: request.user?.email || "-",
      },
        passenger: req.passengerRequests?.map((p) => ({
            id: p.passenger_request_id,
            jumlah: p.jumlah_passenger,
            deskripsi: p.deskripsi
        }))
    };

    res.status(200).json({
      message: "Detail ship request passanger berhasil diambil",
      data: formatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};
