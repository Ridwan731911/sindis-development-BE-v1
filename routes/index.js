import express from "express";
import {
  getUsers,
  getProfile,
  updateUsers,
  updateProfilUsers,
  Register,
  Login,
  Logout,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  createUserRequest,
  getUserRequests,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";
import shipRoutes from "./shipRoute.js";
import northReginRoutes from "./northRegionRoute.js";
import centralRegionRoutes from "./centeralRegionRoute.js";
import southRegionRoutes from "./southRegionRoute.js";
import subseaWellheadRoutes from "./subseaWellheadRoute.js";
import conductorRoutes from "./conductorRoute.js";
import islandRoutes from "./islandRoute.js"
import tangkerRigBargeRoutes from "./tankerRigBargeRoute.js";
import otherRegionRoutes from "./otherRegionRoute.js";
import fuelRoutes from "./fuelRoute.js";
import freshWaterRoutes from "./freshWaterRoute.js";
import requestRoutes from "./requestRoute.js";
import passengerRoutes from "./passengerRoute.js";
import superAdminRoutes from "./superAdminRoute.js";

import {
  getCaptainShipData,
  getApprovedRequests,
  getFleetHistory,
  updateFleetStatus,
  updatePriorityLevel,
  getCaptainShips,
} from "../controller/shipController.js";
import { createRuteDestinasi } from "../controller/ruteController.js";
import {
  getFuelRequests,
  updateFuelRequest,
  getFuelRequestHistory,
} from "../controller/fuelController.js";
import {
  getfwRequests,
  updateFwRequest,
} from "../controller/freshWaterController.js";
import {
  getpassengerRequests,
  updatePassengerRequest,
} from "../controller/passengerController.js";

import { updateCaptainShipPassword } from "../controller/captainShipController.js";

import { getLatestShipMovements } from "../controller/shipMovementsController.js";


const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/allUsers", getAllUsers);
router.post("/createUser", createUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/profile", getProfile);
router.post("/updateUsers", verifyToken, updateUsers);
router.post("/updateProfilUsers", verifyToken, updateProfilUsers);
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

router.post("/create-user-form-request", createUserRequest);
router.get("/get-user-requests", getUserRequests);

router.get("/get-approved-request", getApprovedRequests);

router.get("/get-fuel-request", getFuelRequests);
router.get("/fuel/history", getFuelRequestHistory);
router.put("/fuel-request/:ship_request_id", updateFuelRequest);

router.get("/get-fw-request", getfwRequests);
router.put("/fw-request/:ship_request_id", updateFwRequest);

router.get("/get-passenger-request", getpassengerRequests);
router.put("/passenger-request/:ship_request_id", updatePassengerRequest);

router.get("/fleet-history", getFleetHistory);
router.patch("/update-fleet-status/:id", updateFleetStatus);
router.put("/ship-requests/:id", updatePriorityLevel);

router.post("/rute-destinasi", createRuteDestinasi);
router.put("/captain-ship/:id/password", updateCaptainShipPassword);
router.get("/latest-ship-movements", getLatestShipMovements);


// Ambil data kapten kapal
router.get("/captains", getCaptainShipData);

router.use("/", shipRoutes);
router.use("/", northReginRoutes);
router.use("/", centralRegionRoutes);
router.use("/", southRegionRoutes);
router.use("/", subseaWellheadRoutes);
router.use("/", conductorRoutes);
router.use("/", islandRoutes);
router.use("/", tangkerRigBargeRoutes);
router.use("/", otherRegionRoutes);
router.use("/", fuelRoutes);
router.use("/", freshWaterRoutes);

router.use("/", requestRoutes);
router.use("/", passengerRoutes);
router.use("/", superAdminRoutes);


export default router;
