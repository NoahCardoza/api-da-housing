import express from "express";
const router = express.Router();
import { auth, ICustomMiddleWareRequest  } from "../middleware";
import TeamModel from "../models/Team";
import FavoriteModel from "../models/Favorites";
