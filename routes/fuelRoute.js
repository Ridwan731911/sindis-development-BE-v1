import express from "express";
import {
    createFuel,
    getAllFuel,
    getFuelById,
    updateFuel,
    deleteFuel,
} from "../controller/fuelController.js";

const router = express.Router();

router.post("/create/fuel", createFuel);
router.get("/get-all/fuel", getAllFuel);
router.get("/getById/fuel/:id", getFuelById);
router.put("/update/fuel/:id", updateFuel);
router.delete("delete/fuel/:id", deleteFuel);

export default router;