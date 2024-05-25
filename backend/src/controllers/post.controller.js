import zod from "zod";
import { Post } from "../Models/post.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const postScheme = zod.object({
  name: zod.string(),
  content: zod.string(),
});
const updateSchema = zod.object({
  name: zod.string().optional(),
  content: zod.string().optional(),
});
const checkPostExist = async (id) => {
  const exists = await Post.findById(id);
  if (!exists) {
    return false;
  } else return true;
};
const createPost = AsyncHandler(async (req, res) => {
  const { success } = postScheme.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid Data Format");
  }

  const { name, content } = req.body;
  const image = req.file.path;
  if (!image) {
    throw new apiError(404, "Image is required");
  }
  const imageUrl = await uploadOnCloudinary(image);
  if (!imageUrl) {
    throw new apiError(404, "Image Upload Failed");
  }
  const post = await Post.create({
    name,
    content,
    createdBy: req.user._id,
    image: imageUrl?.url,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, post, "New Post Created Successfully"));
});
const updatePost = AsyncHandler(async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid Data Format");
  }
  const check = await checkPostExist(req.params.id);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const { name, content } = req.body;
  const image = req?.file?.path;
  let imageUrl;
  if (image) {
    imageUrl = await uploadOnCloudinary(image);
    if (!imageUrl) {
      throw new apiError(404, "Image Upload Failed");
    }
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      name,
      content,
      image: imageUrl?.url,
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Updated Successfully"));
});
const deletePost = AsyncHandler(async (req, res) => {
  const check = await checkPostExist(req.params.id);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const post = await Post.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Deleted Successfully"));
});
const likePost = AsyncHandler(async (req, res) => {
  const check = await checkPostExist(req.params.id);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        likes: req.user._id,
      },
      $pull: {
        dislikes: req.user._id,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Liked Successfully"));
});
const dislikePost = AsyncHandler(async (req, res) => {
  const check = await checkPostExist(req.params.id);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: {
        dislikes: req.user._id,
      },
      $pull: {
        likes: req.user._id,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Disliked Successfully"));
});
const commentPost = AsyncHandler(async (req, res) => {
  const check = await checkPostExist(req.params.id);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const { content } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          content,
          createdBy: req.user._id,
        },
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment Added Successfully"));
});
const updateComment = AsyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const check = await checkPostExist(postId);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  const { content } = req.body;
  const post = await Post.findById(postId);
  const comment = post.comments.find((c) => {
    return c._id == commentId;
  });
  if (!comment) {
    throw new apiError(404, "Comment Not Found");
  }
  comment.content = content;
  await post.save();
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment Updated Successfully"));
});
const deleteComment = AsyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const check = await checkPostExist(postId);
  if (!check) {
    throw new apiError(404, "Post Not Found");
  }
  await Post.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

  const post = await Post.findById(postId);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Comment deleted Successfully"));
});
const getPost = AsyncHandler(async (req, res) => {
  const { keyword, asc, desc } = req.query;
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        ],
        as: "createdBy",
      },
    },
    {
      $addFields: {
        createdBy: { $arrayElemAt: ["$createdBy", 0] },
      },
    },
  ];
  let posts = [];
  if (keyword) {
    posts = await Post.aggregate([
      {
        $match: {
          name: { $regex: keyword, $options: "i" },
        },
      },
      ...pipeline,
    ]);
  } else if (asc) {
    posts = await Post.aggregate(pipeline).sort({ createdAt: 1 });
  } else if (desc) {
    posts = await Post.aggregate(pipeline).sort({ createdAt: -1 });
  } else {
    posts = await Post.aggregate(pipeline);
  }
  return res.status(200).json(new ApiResponse(200, posts, "All Posts"));
});
const getComments = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new apiError(400, "Post Not found");
  }
  const response = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $unwind: "$comments",
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.createdBy",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        ],
        as: "comments.createdBy",
      },
    },
    {
      $addFields: {
        "comments.createdBy": { $arrayElemAt: ["$comments.createdBy", 0] },
        "comments.content": "$comments.content",
        "comments._id": "$comments._id",
      },
    },
    {
      $group: {
        _id: "$_id",
        comments: { $push: "$comments" },
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, response[0], "All Comments"));
});
const getPostById = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new apiError(400, "Post Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});
export {
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  commentPost,
  updateComment,
  deleteComment,
  getPost,
  getComments,
  getPostById,
};
