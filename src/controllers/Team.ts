import express from "express";
const router = express.Router();
import { auth, ICustomMiddleWareRequest as cm } from "../middleware";
import TeamModel from "../models/Team";
import FavoriteModel from "../models/Favorites";

/**
 * retrieve a team by id.
 */
router.get("/team/:id", async (req: cm, res) => {
    try {
        return res.status(200).json(await TeamModel.findById(req.params.id).exec());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

export default router;