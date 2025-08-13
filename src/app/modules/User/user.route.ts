import express from "express";
import { UserControllers } from "./user.controller";
const router = express.Router();

router.post("/create", UserControllers.createUser);

export const UserRoutes = router;
