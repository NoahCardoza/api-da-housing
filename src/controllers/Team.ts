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

router.get("/team/create-team", auth, async (req: cm, res) => {
    try {
        const { name, budget } = req.body;
        return res.status(201).json(await new TeamModel({ name, budget, members: [req.user._id] }).save());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

export default router;
