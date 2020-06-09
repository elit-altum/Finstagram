// Handles routes for likes
const User = require("../models/userModel");
const Like = require("../models/likeModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
