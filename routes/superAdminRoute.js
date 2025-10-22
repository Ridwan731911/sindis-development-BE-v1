import express from "express";
import {
    getAllUsersSuperAdmin,
    getUserByIdSuperAdmin,
    updateUserByIdSuperAdmin,
    deleteUserByIdSuperAdmin
} from "../controller/superadmin/superadminController.js";

import {
  getDashboardCards,
  getRequestByCategory,
  getRequestByStatus
} from "../controller/superadmin/superadminDashboardController.js";

const router = express.Router();

router.get("/get/all/users/super-admin", getAllUsersSuperAdmin);
router.get("/get/user/super-admin/:id", getUserByIdSuperAdmin);
router.put("/update/user/super-admin/:id", updateUserByIdSuperAdmin);
router.delete("/delete/user/super-admin/:id", deleteUserByIdSuperAdmin);

// KPI Dashboard
router.get("/cards/dashboard", getDashboardCards);
router.get("/chart/category", getRequestByCategory);
router.get("/pie/status", getRequestByStatus);


export default router;