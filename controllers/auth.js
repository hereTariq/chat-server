import ErrorHandler from '../utils/errorHandler.js';
import userModel from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import jwt from 'jsonwebtoken';

export const signup = catchAsyncError(async (req, res, next) => {
    const existUser = await userModel.findOne({ username: req.body.username });
    if (existUser) {
        return next(new ErrorHandler(400, 'username taken'));
    }
    const user = await userModel.create(req.body);

    const token = jwt.sign({ userId: user._id }, 'secretkey', {
        expiresIn: '1h',
    });

    const { password, ...result } = user.toObject();
    res.status(201).json({
        message: 'user created successfully!',
        success: true,
        user: result,
        token,
    });
});

export const login = catchAsyncError(async (req, res, next) => {
    const existUser = await userModel.findOne({ username: req.body.username });
    // .select('-password');
    if (!existUser) {
        return next(new ErrorHandler(400, 'Account does not exist'));
    }

    const isValid = await existUser.matchPassword(req.body.password);
    if (!isValid) {
        return next(new ErrorHandler(400, 'username or password incorrect.'));
    }

    const token = jwt.sign({ userId: existUser._id }, 'secretkey', {
        expiresIn: '1h',
    });
    const { password, ...result } = existUser.toObject();
    res.status(201).json({
        message: 'user logged-in successfully!',
        success: true,
        user: result,
        token,
    });
});

export const profile = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.userId).select('-password');
    if (!user) {
        return next(new ErrorHandler(401, 'user does not exist'));
    }
    res.status(200).json({
        message: 'profile fetched successfully',
        success: true,
        user,
    });
});

export const allUsers = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    const users = await userModel
        .find({ _id: { $ne: userId } })
        .select('-password');

    if (users.length == 0) {
        return next(new ErrorHandler(404, 'No user available'));
    }

    res.status(200).json({
        message: 'users fetched successfully',
        success: true,
        users,
    });
});
