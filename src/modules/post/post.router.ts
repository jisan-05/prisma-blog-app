import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import {auth as betterAuth} from '../../lib/auth'

const router = express.Router();

const auth = (...roles:any) =>{
  return async(req:Request,res:Response,next:NextFunction)=>{
    const session = await betterAuth.api.getSession({
      headers:req.headers as any 
    })

    console.log(session)
  }
}


router.post("/",auth("ADMIN","USER"), PostController.createPost);

export const postRouter: Router = router;
