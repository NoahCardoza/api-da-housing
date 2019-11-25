import express from "express";
const router = express.Router();
import { auth, ICustomMiddleWareRequest, isTeamMember } from "../middleware";
import TeamModel from "../models/Team";

router.get("/team/:teamid", isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        if (!req.team) { return res.status(400).send("Team not found."); }
        return res.status(200).json(req.team);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

export default router;
