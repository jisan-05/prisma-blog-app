import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import {auth as betterAuth} from '../../lib/auth'
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();


router.get("/",PostController.getAllPost)

router.post("/",auth(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
