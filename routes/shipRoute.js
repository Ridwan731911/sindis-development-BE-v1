import express from "express";
import { getShipData } from "../controller/shipController.js";
import { fetchAndSaveShipData } from "../controller/shipPositionController.js";
import { saveOneShipToDatabase, getOneShipFromDatabase } from "../controller/shipController.js";

const router = express.Router();

router.get("/get-all/ships", getShipData);
router.post("/ships/save-one", saveOneShipToDatabase);
router.get("/ships/local", getOneShipFromDatabase)

router.get("/sync-ship-data", async (req, res) => {
  await fetchAndSaveShipData();
  res.json({ message: "Sinkronisasi selesai." });
});

export default router;
