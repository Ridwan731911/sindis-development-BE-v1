import axios from "axios";
import dotenv from "dotenv";
import ShipPosition from "../models/shipPositionModel.js";

dotenv.config();

const API_URL = "https://api.scu.co.id/vtms/oses/position?mmsi=all";
const BEARER_TOKEN = process.env.SHIP_API_TOKEN;

export const fetchAndSaveShipData = async () => {
  try {
    const response = await axios.post(
      API_URL,
      {
        start_date: "2025-06-01",
        end_date: "2025-06-15",
        vessel_name: "ALL",
      },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const ships = response.data.data;

    for (const ship of ships) {
      const mmsi = ship.MMSI; 
      const date = new Date(ship.date);

      if (!mmsi || !ship.date) continue;

      const exists = await ShipPosition.findOne({
        where: {
          mmsi: mmsi,
          date: date,
        },
      });

      if (!exists) {
        await ShipPosition.create({
          mmsi: mmsi,
          name: ship.name,
          lat: ship.lat,
          lon: ship.lon,
          speed: ship.speed,
          heading: ship.heading,
          port: ship.port,
          date: date,
        });
      }
    }

    console.log("✅ Ship data updated.");
  } catch (error) {
    console.error("❌ Failed to fetch/save ship data:", error.message);
  }
};
