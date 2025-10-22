import express from "express";
import {
    createOtherRegion,
    getAllOtherRegion,
    getOtherRegionById,
    updateOtherRegion,
    deleteOtherRegion,
} from "../controller/locations/otherRegionController.js";

const router = express.Router();

router.post("/create/other-region", createOtherRegion);
router.get("/get-all/other-region", getAllOtherRegion);
router.get("/getById/other-region/:id", getOtherRegionById);
router.put("/update/other-region/:id", updateOtherRegion);
router.delete("delete/other-region/:id", deleteOtherRegion);

export default router;