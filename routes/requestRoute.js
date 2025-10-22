import express from "express";
import {
    addShipRequest,
    getAllShipRequests,
    getAllShipRequestsById
  
} from "../controller/request/requestController.js";

import {
    getFuelRequests,
    getFuelRequestById
} from "../controller/request/fuelRequestController.js";

import {
    getFwRequests,
    getFreshWaterRequestById
} from "../controller/request/fwRequestController.js";

import {
    getPassangerRequests,
    getPassangerRequestById
} from "../controller/request/passangerRequestController.js";

const router = express.Router();

router.post("/add/request", addShipRequest);
router.get("/get-all/request", getAllShipRequests);
router.get("/get-all/request/:id", getAllShipRequestsById);
router.get("/get/fuel/request", getFuelRequests);
router.get("/get/fuel/request/:id", getFuelRequestById);
router.get("/get/freshwater/request", getFwRequests);
router.get("/get/freshwater/request/:id", getFreshWaterRequestById);
router.get("/get/passanger/request", getPassangerRequests);
router.get("/get/passanger/request/:id", getPassangerRequestById);

// router.get("/get-all/request", getAllRequest);
// router.get("/getById/request/:id", getRequestById);
// router.put("/update/request/:id", updateRequest);
// router.delete("delete/request/:id", deleteRequest);

export default router;