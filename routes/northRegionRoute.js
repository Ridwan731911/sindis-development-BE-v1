import express from "express";
import {
  createNorthRegion,
  getAllNorthRegion,
  getNorthRegionById,
  updateNorthRegion,
  deleteNorthRegion,
} from "../controller/locations/northRegionController.js";

const router = express.Router();

router.post("/create/north-region", createNorthRegion);
router.get("/get-all/north-region", getAllNorthRegion);
router.get("/getById/north-region/:id", getNorthRegionById);
router.put("/update/north-region/:id", updateNorthRegion);
router.delete("delete/north-region/:id", deleteNorthRegion);

export default router;
