import express from "express";
import {
    createIsland,
    getAllIsland,
    getIslandById,
    updateIsland,
    deleteIsland
} from '../controller/locations/islandController.js';

const router = express.Router();

router.post("/create/island", createIsland);
router.get("/get-all/island", getAllIsland);
router.get("/getById/island/:id", getIslandById);
router.put("/update/island/:id", updateIsland);
router.delete("delete/island/:id", deleteIsland);

export default router;