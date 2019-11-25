import express from "express";
const router = express.Router();
import { auth, ICustomMiddleWareRequest, isTeamMember } from "../middleware";
import TeamModel from "../models/Team";

router.get("/team/:teamid", auth, isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
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

router.delete("/team/:teamid", auth, isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        await TeamModel.findByIdAndDelete(req.team._id).exec();
        return res.status(202);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.put("/team/leave-team/:teamid", auth, isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        const members = req.team.members.filter((e) => e !== req.user._id);
        if (members.length < 1) {
            await TeamModel.findByIdAndDelete(req.team._id).exec();
            return res.status(204);
        } else if (members.length >= 1) {
            await TeamModel.findByIdAndUpdate(req.team._id, { members }).exec();
            return res.status(204);
        }
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.put("/team/add-favorite/:teamid", auth, isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        const { source, name } = req.body;
        const favoriteSet = new Set(req.body.favorites);
        favoriteSet.add({ source, name });
        await TeamModel.findByIdAndUpdate(req.team._id, { favorites: Array.from(favoriteSet) }).exec();
        return res.status(204);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.put("/team/delete-favorite/:teamid", auth, isTeamMember, async (req: ICustomMiddleWareRequest, res) => {
    try {
        const favorites = req.team.favorites.filter((e) => e !== req.body.favorite);
        await TeamModel.findByIdAndUpdate(req.team._id, { favorites }).exec();
        return res.status(204);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

export default router;
