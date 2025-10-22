import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/database.js";
import router from "./routes/index.js";
import Users from "./models/userModel.js";
import ShipPosition from "./models/shipPositionModel.js";
import FreshWater from "./models/freshWaterModel.js";
import { saveShipInternal } from "./controller/shipController.js";
import Fuel from "./models/fuelModel.js";
import Passenger from "./models/passengerModel.js";
import ShipRequest from "./models/shipRequestModel.js";
import FuelRequest from "./models/fuelRequestModel.js";
import FreshWaterRequest from "./models/freshWaterRequestModel.js";
import PassengerRequest from "./models/passengerRequestModel.js";
import NortRegion from "./models/northRegionModel.js";
import SouthRegion from "./models/southRegionModel.js";
import CentralRegion from "./models/centralRegionModel.js";
import SubseaWellhead from "./models/subseaWellheadModel.js";
import Conductor from "./models/conductorModel.js";
import Island from "./models/islandModel.js";
import TankerRigBarge from "./models/tankerRigBargeModel.js";
import OtherRegion from "./models/otherRegionModel.js";
import RuteDestinasi from "./models/ruteDestinasiModel.js";
import RuteStep from "./models/ruteStepModel.js";
import ShipMovement from "./models/shipMovementsModel.js";
import { getCaptainShipData, saveAllShipPositions } from "./controller/shipController.js";
import cron from "node-cron";
import { recordShipMovements } from "./controller/shipMovementsController.js";


dotenv.config();
const app = express();
const PORT = 5000;

async function initializeDatabase() {
  try {
    await db.authenticate();
    console.log("Database connected.");
    await Users.sync();
    await ShipPosition.sync();
    await FreshWater.sync();
    await Fuel.sync();
    await Passenger.sync();
    await ShipRequest.sync();
    await FuelRequest.sync();
    await FreshWaterRequest.sync();
    await PassengerRequest.sync();
    await NortRegion.sync();
    await SouthRegion.sync();
    await CentralRegion.sync();
    await SubseaWellhead.sync();
    await Conductor.sync();
    await Island.sync();
    await TankerRigBarge.sync();
    await OtherRegion.sync();
    await RuteDestinasi.sync();
    await RuteStep.sync();
    await ShipMovement.sync();
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

initializeDatabase();

app.use(bodyParser.json({ limit: "10mb" }));
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// 🔑 CORS setup
const allowedOrigins = ["http://localhost:3000", "https://www.sindis.id"];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.get("/", async (req, res) => {
  try {
    const [tables] = await db.query("SHOW TABLES");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    // Bagi jadi dua kolom
    const half = Math.ceil(tableNames.length / 2);
    const left = tableNames.slice(0, half);
    const right = tableNames.slice(half);

    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 40px;
            color: #333;
          }
          .card {
            max-width: 700px;
            margin: auto;
            background: #fff;
            padding: 25px;
            border-radius: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          }
          h1 {
            font-size: 22px;
            color: #111;
            margin-bottom: 15px;
            text-align: center;
          }
          h1 span {
            color: #16a34a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 10px 14px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 15px;
            text-align: left;
          }
          th {
            background: #f3f4f6;
            color: #111;
          }
          tr:hover td {
            background: #f9fafb;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Database <span>Connected</span></h1>
          <table>
            <thead>
              <tr>
                <th style="width:50%">Daftar Tabel</th>
                <th style="width:50%">Daftar Tabel</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: half })
                .map((_, i) => `
                  <tr>
                    <td>${left[i] || ""}</td>
                    <td>${right[i] || ""}</td>
                  </tr>
                `)
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
    </html>
    `;

    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
  }
});


app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

cron.schedule("*/5 * * * * *", async () => {
//   console.log("Menjalankan update data captain ship...");
  try {
    await saveAllShipPositions();
    await getCaptainShipData(
      { body: {} },
      {
        status: (code) => ({
          json: (data) => console.log("Response:", code, data),
        }),
      }
    );
  } catch (err) {
    console.error("Error saat update captain ship:", err.message);
  }
});
// jalan ship movements
cron.schedule("* * * * *", async () => {
  console.log("Menjalankan pencatatan pergerakan kapal...");
  await recordShipMovements();
});
// ⏱️ Simpan data kapal setiap 1 menit tanpa duplikasi
// setInterval(() => {
//   saveShipInternal();
// }, 5 * 1000);
