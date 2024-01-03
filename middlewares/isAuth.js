import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from './catchAsyncError.js';
import jwt from 'jsonwebtoken';

export const isAuth = catchAsyncError(async (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
        return next(new ErrorHandler(401, 'Unauthorized'));
    }

    const token = bearerToken.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secretkey');

    if (!decodedToken) {
        return next(new ErrorHandler(401, 'Unauthorized'));
    }
    req.userId = decodedToken.userId;

    next();
});
