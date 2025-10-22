import express from "express";
import {
    createPassenger,
    getAllPassenger,
    getPassengerById,
    updatePassenger,
    deletePassenger,
} from "../controller/passengerController.js";

const router = express.Router();    

router.post("/create/passenger", createPassenger);
router.get("/get-all/passenger", getAllPassenger);
router.get("/getById/passenger/:id", getPassengerById);
router.put("/update/passenger/:id", updatePassenger);
router.delete("delete/passenger/:id", deletePassenger);

export default router;