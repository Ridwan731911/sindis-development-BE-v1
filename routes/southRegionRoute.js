import express from "express";
import {
    createSouthRegion,
    getAllSouthRegion,
    getSouthRegionById,
    updateSouthRegion,
    deleteSouthRegion,
} from '../controller/locations/southRegionController.js';

const router = express.Router();

router.post("/create/south-region", createSouthRegion);
router.get("/get-all/south-region", getAllSouthRegion);
router.get("/getById/south-region/:id", getSouthRegionById);
router.put("/update/south-region/:id", updateSouthRegion);
router.delete("delete/south-region/:id", deleteSouthRegion);

export default router;