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

/**
 * create a team if you're a user.
 */
router.post("/team/create-team", auth, async (req: cm, res) => {
    try {
        const { name, budget } = req.body;
        return res.status(201).json(await new TeamModel({ name, budget, members: [req.user._id] }).save());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/**
 * update a team by id.
 */
router.put("/team/update-team/:id", async (req: cm, res) => {
    try {
        return res.status(204).json(await TeamModel.findByIdAndUpdate(req.params.id, req.body).exec());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/**
 * add a favorite to a team by id.
 */
router.put("/team/add-favorite/:id", async (req: cm, res) => {
    try {
        const { source, name } = req.body;
        const favorite = await new FavoriteModel({ source, name, team: req.params._id }).save();
        const team = await TeamModel.findById(req.params._id).exec();
        team.favorites.push(favorite._id);
        return res.status(204).json(await team.save());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/**
 * delete a favorite to a team by id.
 */
router.put("/team/delete-favorite/:id", async (req: cm, res) => {
    try {
        const { source } = req.body;
        const team = await TeamModel.findById(req.params.id).exec();
        team.favorites = team.favorites.filter((favorite) => favorite !== source);
        return res.status(204).json(await team.save());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

router.put("/team/favorites/:id", async(req: cm, res) => {
    try {
        return res.status(200).json()
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/**
 * Should make a member leave a team.
 */
router.put("team/leave-team/:id", auth, async (req: cm, res) => {
    try {
        const team = await TeamModel.findById(req.params.id).exec();
        team.members.filter((member) => member !== req.user._id);
        return res.status(204).json(await team.save());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

/**
 * It should delete a team.
 */
router.delete("/team/:id", async (req: cm, res) => {
    try {
        return res.status(202).json(await TeamModel.findByIdAndDelete(req.params.id).exec());
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

export default router;
