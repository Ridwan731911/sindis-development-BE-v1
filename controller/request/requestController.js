import ShipRequest from "../../models/shipRequestModel.js";
import FuelRequest from "../../models/fuelRequestModel.js";
import FreshWaterRequest from "../../models/freshWaterRequestModel.js";
import PassengerRequest from "../../models/passengerRequestModel.js";
import ShipPosition from "../../models/shipPositionModel.js";
import Users from "../../models/userModel.js";
import db from "../../config/database.js";


// Helper generate ID
const generateId = (prefix) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return `${prefix}-${y}${m}${d}-${h}${min}${s}`;
};

export const addShipRequest = async (req, res) => {
    const t = await db.transaction();
    try {
        const {
            ship_position_id,
            id, // user id
            tanggal_request,
            kordinat_request,
            email,
            kategori_request,
            status_request,
            fuelRequests,
            freshWaterRequests,
            passengerRequests,
        } = req.body;

        // 1. Generate ID untuk ship request
        const ship_request_id = generateId("SR");

        // 2. Insert ke tabel utama
        const newShipRequest = await ShipRequest.create({
            ship_request_id,
            ship_position_id,
            id,
            tanggal_request,
            kordinat_request,
            email,
            kategori_request,
            status_request,
        }, {
            transaction: t
        });

        // 3. Cek kategori dan insert ke tabel turunan
        if (kategori_request.includes("fuel") && Array.isArray(fuelRequests)) {
            for (const fuel of fuelRequests) {
                await FuelRequest.create({
                    fuel_request_id: generateId("FR"),
                    ship_request_id,
                    jenis_fuel: fuel.jenis_fuel,
                    jenis_material: fuel.jenis_material,
                    kuantiti: fuel.kuantiti,
                    satuan_ukur: fuel.satuan_ukur,
                }, {
                    transaction: t
                });
            }
        }

        if (kategori_request.includes("freshwater") && Array.isArray(freshWaterRequests)) {
            for (const fw of freshWaterRequests) {
                await FreshWaterRequest.create({
                    fresh_water_request_id: generateId("FW"),
                    ship_request_id,
                    volume_fresh_water: fw.volume_fresh_water,
                    satuan_ukur: fw.satuan_ukur,
                }, {
                    transaction: t
                });
            }
        }

        if (kategori_request.includes("passanger") && Array.isArray(passengerRequests)) {
            for (const ps of passengerRequests) {
                await PassengerRequest.create({
                    passenger_request_id: generateId("PR"),
                    ship_request_id,
                    jumlah_passenger: ps.jumlah_passenger,
                    deskripsi: ps.deskripsi,
                }, {
                    transaction: t
                });
            }
        }

        await t.commit();

        res.status(201).json({
            message: "Ship request berhasil dibuat",
            data: newShipRequest,
        });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message
        });
    }
};

export const getAllShipRequests = async (req, res) => {
    try {
        const requests = await ShipRequest.findAll({
            include: [{
                    model: ShipPosition,
                    as: "position",
                    attributes: ["name"]
                },
     
                {
                    model: Users,
                    as: "user",
                    attributes: ["name", "email"]
                }, // ambil nama user
                {
                    model: FuelRequest,
                    as: "fuelRequests"
                },
                {
                    model: FreshWaterRequest,
                    as: "freshWaterRequests"
                },
                {
                    model: PassengerRequest,
                    as: "passengerRequests"
                },
            ],
            order: [
                ["tanggal_request", "DESC"]
            ],
        });

        res.status(200).json({
            message: "Daftar ship request berhasil diambil",
            data: requests,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan",
            error: error.message
        });
    }
};


export const getAllShipRequestsById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ShipRequest.findOne({
      where: {
        ship_request_id: id
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
          model: FuelRequest,
          as: "fuelRequests",
          attributes: [
            "fuel_request_id",
            "jenis_fuel",
            "jenis_material",
            "kuantiti",
            "satuan_ukur",
          ],
        },
        {
        model: FreshWaterRequest,
        as: "freshWaterRequests",
        attributes: [
            "fresh_water_request_id",
            "volume_fresh_water",
            "satuan_ukur"
            ]
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

    // Jika data tidak ditemukan
    if (!request) {
      return res.status(404).json({
        message: `Ship request dengan id ${id} tidak ditemukan`,
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
      fuel: request.fuelRequests?.map((f) => ({
        id: f.fuel_request_id,
        jenisFuel: f.jenis_fuel,
        jenisMaterial: f.jenis_material,
        kuantiti: f.kuantiti,
        satuan: f.satuan_ukur,
      })),
      freshWater: request.freshWaterRequests?.map((w) => ({
        id: w.fresh_water_request_id,
        volume: w.volume_fresh_water,
        satuan: w.satuan_ukur,
      })),
        passenger: request.passengerRequests?.map((p) => ({
            id: p.passenger_request_id,
            jumlah: p.jumlah_passenger,
            deskripsi: p.deskripsi
        }))
    };

    res.status(200).json({
      message: "Detail ship request berhasil diambil",
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