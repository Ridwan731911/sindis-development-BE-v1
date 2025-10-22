import express from "express";
import {
    createSubseaWellhead,
    getAllSubseaWellhead,
    getSubseaWellheadById,
    updateSubseaWellhead,
    deleteSubseaWellhead,
} from "../controller/locations/subseaWellheadController.js";

const router = express.Router();

router.post("/create/subsea-wellhead", createSubseaWellhead);
router.get("/get-all/subsea-wellhead", getAllSubseaWellhead);
router.get("/getById/subsea-wellhead/:id", getSubseaWellheadById);
router.put("/update/subsea-wellhead/:id", updateSubseaWellhead);
router.delete("delete/subsea-wellhead/:id", deleteSubseaWellhead);

export default router;