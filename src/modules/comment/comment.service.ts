import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { CommentStatus } from "../../../generated/prisma/enums";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentsByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where:{
      authorId
    },
    orderBy:{
      createdAt:'desc'
    },
    include:{
      post:{
        select:{
          id:true,
          title:true
        }
      }
    }
  })
};

// 1. nijer comment delete korte parbe
// login thakte hobe
// tar nijer comment kina check korte hobe
const deleteComment = async(commentId:string,authorId:string) =>{
  const commentData = await prisma.comment.findFirst({
    where:{
      id:commentId,
      authorId
    },
    select:{
      id:true
    }
  })
  if(!commentData){
    throw new Error("Your provided input is invalid!")
  }

  return await prisma.comment.delete({
    where:{
      id:commentData.id
    }
  })

}

const updateComment = async(commentId:string,data:{content?:string,status?:CommentStatus},authorId:string) =>{
   const commentData = await prisma.comment.findFirst({
    where:{
      id:commentId,
      authorId
    },
    select:{
      id:true
    }
  })
  if(!commentData){
    throw new Error("Your provided input is invalid!")
  }
  console.log({commentId,data,authorId});
  return await prisma.comment.update({
    where:{
      id:commentId,
      authorId
    },
    data
  })
}

const moderateComment = async(id:string,data:{status:CommentStatus}) =>{
  const commentData = await prisma.comment.findUniqueOrThrow({
    where:{
      id
    },
    select:{
      id:true,
      status:true
    }
  })

  if(commentData.status === data.status ){
    throw new Error(`Your provided status ${data.status} is already up to date`)
  }

  return await prisma.comment.update({
    where:{
      id 
    },
    data
  })

}

export const commentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment
};
