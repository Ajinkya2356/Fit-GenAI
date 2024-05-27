import AsyncHandler from "../utils/AsyncHandler.js";
import { User } from "../Models/user.model.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import zod from "zod";
import { Challenge } from "../Models/challenge.model.js";
import mongoose from "mongoose";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};
const registerBody = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  name: zod.string(),
  password: zod.string(),
});
const loginBody = zod.object({
  username: zod.string().optional(),
  email: zod.string().email().optional(),
  password: zod.string(),
});
const registerUser = AsyncHandler(async (req, res) => {
  const { username, email, name, password } = req.body;
  const { success } = registerBody.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid Inputs");
  }
  if (
    [name, username, email, password].some((item) => {
      item?.trim() === "";
    })
  ) {
    throw new apiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new apiError(400, "Username Already Taken or Email Already Exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  //console.log(req.files?.avatar?.[0]);
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new apiError(500, "Error uploading avatar");
  }
  const user = await User.create({
    username,
    email,
    name,
    password,
    avatar: avatar.url,
  });
  const check = await User.findById(user._id).select("-password");
  if (!check) {
    throw new apiError(500, "Something went wrong");
  }
  await sendOnBoardingMail(email, name);
  return res
    .status(201)
    .json(new ApiResponse(200, check, "User registered successfully"));
});
const loginUser = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const { success } = loginBody.safeParse(req.body);
  if (!success) {
    throw new apiError(404, "Invalid inputs");
  }
  if (!username || !password) {
    throw new apiError(400, "Username and password are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiResponse(400, null, "User does not exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid username or password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedIn) {
    throw new apiError(500, "Something went wrong");
  }
  const options = {
    httpOnly: true,
    domain: "localhost",
    path: "/",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedIn, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const getUser = AsyncHandler(async (req, res) => {
  const user = await User.findOne(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: user }, "User Details fetched successfully")
    );
});
const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new apiError(400, "Old and new password are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Old password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const updateAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new apiError(500, "Error uploading avatar");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: avatar.url,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: avatar.url },
        "Avatar updated successfully"
      )
    );
});
const updateProfile = AsyncHandler(async (req, res) => {
  const { name, username, email } = req.body;

  if (!name || !username || !email) {
    throw new apiError(400, "All fields are required");
  }
  const existingUser = await User.find({
    $or: [{ username }, { email }],
  }).select("-password -refreshToken");
  if (existingUser.length > 1) {
    throw new apiError(400, "Username or Email already exists");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { name, username, email },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});
const resetPasswordToken = async (email) => {
  return jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET);
};
const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(400, "Email is required");
  }
  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const resetToken = await resetPasswordToken(email);
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetPassword/${resetToken}`;
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Click on the link to reset your password: ${resetPasswordUrl}`;
  try {
    await sendEmail({
      email,
      subject: "Password reset",
      message,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Password reset link sent to email successfully"
        )
      );
  } catch (err) {
    // console.log(err)
    throw new apiError(500, "Error while sending email try again");
  }
});
const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!token) {
    throw new apiError(400, "Invalid token");
  }
  if (!newPassword || !confirmPassword) {
    throw new apiError(400, "New and confirm password are required");
  }
  if (newPassword !== confirmPassword) {
    throw new apiError(400, "Passwords do not match");
  }
  const { email } = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
  // console.log("Email", email);
  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});
const sendPromotionMails = AsyncHandler(async (req, res) => {
  const { messageHTML } = req.body;
  if (!messageHTML) {
    throw new apiError(400, "Message is required");
  }
  const emails = await User.find().select("email");
  if (!emails) {
    throw new apiError(404, "No emails found");
  }
  const message = "Get 50% off on all products";
  try {
    emails.forEach(async (email) => {
      await sendEmail({
        email,
        subject: "Promotion",
        message,
        messageHTML,
      });
    });
  } catch (err) {
    throw new apiError(500, "Error while sending email try again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Promotion Emails sent"));
});
const sendOnBoardingMail = async (email, name) => {
  if (!email) throw new apiError(400, "Email is required");
  const message = "Welcome to our platform";
  const messageHTML = `<h1>Welcome ${name} to our platform</h1>`;
  try {
    await sendEmail({
      email,
      subject: "Welcome",
      message,
      messageHTML,
    });
  } catch (err) {
    throw new apiError(500, "Error while sending email try again");
  }
};
const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingToken) throw new apiError(401, "Unauthorized Request");
  try {
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.JWT_REFRESH_SECRET
    );
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }
    if (incomingToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh Token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    // console.log("Refresh Token", refreshToken);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new apiError(401, "Invalid Refresh Token");
  }
});
const getSingleUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully"));
});
const getMultipleUsers = AsyncHandler(async (req, res) => {
  const userIDs = req.body.userIDs;
  const users = await User.find({ _id: { $in: userIDs } }).select(
    "-password -refreshToken"
  );
  if (!users || users.length === 0) {
    throw new apiError(404, "Users not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully"));
});
const addCoins = AsyncHandler(async (req, res) => {
  const { coins } = req.body;
  if (!coins) {
    throw new apiError(400, "Coins are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $inc: { coinBalance: coins },
    },
    { new: true }
  );
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Coins added successfully"));
});
const getLeaderBoard = AsyncHandler(async (req, res) => {
  try {
    let users = await User.aggregate([
      {
        $project: {
          _id: 1,
          username: 1,
          avatar: 1,
          coinBalance: 1,
        },
      },
      {
        $sort: {
          coinBalance: -1,
        },
      },
    ]).limit(10);
    users = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
    const check = users.some(
      (user) => user._id.toString() === req.user._id.toString()
    );
    if (!check) {
      const currentUser = await User.findById(req.user._id).select(
        "_id username avatar coinBalance"
      );
      const currentUserRank =
        (await User.countDocuments({
          coinBalance: { $gt: currentUser.coinBalance },
        })) + 1;
      users = users.slice(0, 9);
      users.push({
        _id: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        coinBalance: currentUser.coinBalance,
        rank: currentUserRank,
      });
      users.sort((a, b) => b.coinBalance - a.coinBalance);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "LeaderBoard Fetched Successfully"));
  } catch (error) {
    throw new apiError(404, error.message);
  }
});
const getChallengeLeaderBoard = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let users = await Challenge.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                avatar: 1,
                coinBalance: 1,
              },
            },
            {
              $sort: {
                coinBalance: -1,
              },
            },
            {
              $limit: 10,
            },
          ],
          as: "users",
        },
      },
      {
        $project: {
          _id: 0,
          users: 1,
        },
      },
    ]);
    if (!users || users.length === 0) {
      throw new apiError(404, "No users found");
    }
    users = users[0].users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          users,
          "Challenge LeaderBoard Fetched Successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new apiError(404, error.message);
  }
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  changePassword,
  updateAvatar,
  updateProfile,
  forgotPassword,
  resetPassword,
  sendPromotionMails,
  refreshAccessToken,
  getSingleUser,
  getMultipleUsers,
  addCoins,
  getLeaderBoard,
  getChallengeLeaderBoard,
};
