import express from "express";
import {
    createTankerRigBarge,
    getAllTankerRigBarge,
    getTankerRigBargeById,
    updateTankerRigBarge,
    deleteTankerRigBarge,
} from "../controller/locations/tankerRigBargeController.js";

const router = express.Router();

router.post("/create/tanker-rig-barge", createTankerRigBarge);
router.get("/get-all/tanker-rig-barge", getAllTankerRigBarge);
router.get("/getById/tanker-rig-barge/:id", getTankerRigBargeById);
router.put("/update/tanker-rig-barge/:id", updateTankerRigBarge);
router.delete("delete/tanker-rig-barge/:id", deleteTankerRigBarge);


export default router;