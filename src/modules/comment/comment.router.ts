import express, { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get(
  "/:commentId",
  commentController.getCommentById 
)

router.get(
  "/author/:authorId",
  commentController.getCommentsByAuthor
)

router.post(
  "/",
  auth(UserRole.USER,UserRole.ADMIN),
  commentController.createComment
)

router.delete(
  "/:commentId",
  auth(UserRole.USER,UserRole.ADMIN),
  commentController.deleteComment
)
router.patch(
  "/:commentId",
  auth(UserRole.USER,UserRole.ADMIN),
  commentController.updateComment
)


export const commentRouter: Router = router;
