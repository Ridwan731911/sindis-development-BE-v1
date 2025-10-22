import express from "express";
import {
    createConductor,
    getAllConductor,
    getConductorById,
    updateConductor,
    deleteConductor
} from '../controller/locations/conductorController.js';

const router = express.Router();

router.post("/create/conductor", createConductor);
router.get("/get-all/conductor", getAllConductor);
router.get("/getById/conductor/:id", getConductorById);
router.put("/update/conductor/:id", updateConductor);
router.delete("delete/conductor/:id", deleteConductor);

export default router;