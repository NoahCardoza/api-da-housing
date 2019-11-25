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

router.post("/team/create-team", auth, async (req: ICustomMiddleWareRequest, res) => {
    try {
        if (!req.body.members.includes(req.user._id)) {
            req.body.members.push(req.user._id);
        }
        const { name, budget, favorites, members } = req.body;
        const Team = new TeamModel({
            name, budget, favorites, members
        });
        await Team.save();
        return res.status(201).json(Team);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.post("/team/update-team/:teamid", isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        const Team = await TeamModel.findByIdAndUpdate(req.team._id, req.body).exec();
        return res.status(204).json(Team);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.delete("/team/:teamid", isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        await TeamModel.findByIdAndDelete(req.team._id).exec();
        return res.status(204);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

export default router;
