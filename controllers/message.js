import messageModel from '../models/message.js';
import { io } from '../index.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { senderId, receiverId, content } = req.body;

    const newConversation = await messageModel.findOneAndUpdate(
        {
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        },
        { $push: { messages: { content } }, $set: { senderId, receiverId } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // io.to(receiverSocketId).emit('newMessage', newMessage);

    // Emit the message to the receiver via Socket.IO if online
    // const receiverSocketId = '';

    res.status(200).json({
        message: 'Message sent successfully',
        success: true,
        newConversation,
    });
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
    const { senderId, receiverId } = req.params;

    let conversation = await messageModel.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    });
    // .populate('senderId receiverId')
    if (!conversation) {
        return next(new ErrorHandler(404, 'Conversation not found'));
    }

    conversation = conversation.messages.sort(
        (a, b) => b.timestamp - a.timestamp
    );

    // console.log(conversation);

    res.status(200).json({
        success: true,
        message: 'conversation fetched successfully',
        conversation,
    });
});
