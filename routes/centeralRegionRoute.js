import express from "express";
import {
  createCentralRegion,
  getAllCentralRegion,
  getCentralRegionById,
  updateCentralRegion,
  deleteCentralRegion,
} from "../controller/locations/centralRegionController.js";

const router = express.Router();

// Create Central Region
router.post("/create/central-region", createCentralRegion);

// Get All Central Regions
router.get("/get-all/central-region", getAllCentralRegion);

// Get Central Region by ID
router.get("/getById/central-region/:id", getCentralRegionById);

// Update Central Region
router.put("/update/central-region/:id", updateCentralRegion);

// Delete Central Region
router.delete("/delete/central-region/:id", deleteCentralRegion);

export default router;
