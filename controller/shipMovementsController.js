import ShipMovement from "../models/shipMovementsModel.js";
import CaptainShip from "../models/captainShipModel.js";


// conttrol create record ship movement
export const recordShipMovements = async (req, res) => {
  try {
    // Ambil semua kapal aktif
    const captains = await CaptainShip.findAll({ where: { status: "active" } });

    if (!captains.length) {
      console.log("❌ Tidak ada kapal aktif yang dicatat.");
      if (res) return res.status(404).json({ message: "No active ships" });
      return;
    }

    for (const captain of captains) {
      // Ambil data pergerakan terakhir kapal ini
      const lastMovement = await ShipMovement.findOne({
        where: { id_captain_ship: captain.id_captain_ship },
        order: [["createdAt", "DESC"]],
      });

      // Jika belum ada data sebelumnya, langsung buat
      if (!lastMovement) {
        await ShipMovement.create({
          id_ship_movements: `SM-${Date.now().toString().slice(-8)}`,
          id_captain_ship: captain.id_captain_ship,
          name: captain.name,
          lat: captain.latitude,
          lng: captain.longitude,
        });
        console.log(`✅ Ship movement recorded for ${captain.name} (first record)`);
        continue;
      }
      // Bandingkan koordinat
      const isSamePosition =
        lastMovement.lat === captain.latitude && lastMovement.lng === captain.longitude;

      if (isSamePosition) {
        console.log(` ${captain.name} tidak bergerak, data tidak disimpan.`);
        continue;
      }

      // Jika bergerak, simpan data baru
      await ShipMovement.create({
        id_ship_movements: `SM-${Date.now().toString().slice(-8)}`,
        id_captain_ship: captain.id_captain_ship,
        name: captain.name,
        lat: captain.latitude,
        lng: captain.longitude,
      });

      console.log(`✅ Ship movement recorded for ${captain.name}`);
    }

    if (res) {
      return res.status(201).json({ message: "Ship movements recorded successfully" });
    }
  } catch (error) {
    console.error("❌ Error recording movements:", error.message);
    if (res) return res.status(500).json({ message: error.message });
  }
};


// controller get record ship movement
export const getLatestShipMovements = async (req, res) => {
  try {
    const movements = await ShipMovement.findAll({
      order: [["createdAt", "DESC"]], // urutkan dari terbaru
      attributes: ["id_ship_movements", "id_captain_ship", "name", "lat", "lng"], // kolom yang ingin ditampilkan
    });

    if (!movements.length) {
      return res.status(404).json({ message: "Belum ada data pergerakan kapal." });
    }

    // Tambahkan nomor urut
    const formattedData = movements.map((item, index) => ({
      no: index + 1,
      id_ship_movements: item.id_ship_movements,
      id_captain_ship: item.id_captain_ship,
      name: item.name,
      lat: item.lat,
      lng: item.lng,
    }));

    return res.status(200).json({
      message: "Semua data pergerakan kapal berhasil diambil.",
      total: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("❌ Error fetching ship movements:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
