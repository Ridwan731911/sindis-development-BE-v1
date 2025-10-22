import express from "express";
import {
    createFreshWater,
    getAllFreshWater,
    getFreshWaterById,
    updateFreshWater,
    deleteFreshWater,
} from "../controller/freshWaterController.js";

const router = express.Router();

router.post("/create/fresh-water", createFreshWater);
router.get("/get-all/fresh-water", getAllFreshWater);
router.get("/getById/fresh-water/:id", getFreshWaterById);
router.put("/update/fresh-water/:id", updateFreshWater);
router.delete("delete/fresh-water/:id", deleteFreshWater);

export default router;
