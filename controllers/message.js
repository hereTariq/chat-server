import messageModel from '../models/message.js';
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

    res.status(200).json({
        message: 'Message sent successfully',
        success: true,
        newConversation,
    });
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
    const { senderId, receiverId } = req.params;

    let conversation = await messageModel
        .findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        })
        .select('messages -_id');

    // .populate('senderId receiverId')
    if (!conversation) {
        return next(new ErrorHandler(404, 'Conversation not found'));
    }

    // if (conversation) {
    //     conversation.messages.sort((a, b) => {
    //         return new Date(b.timestamp) - new Date(a.timestamp);
    //     });
    // }
    // console.log(conversation);

    res.status(200).json({
        success: true,
        message: 'conversation fetched successfully',
        conversation,
    });
});
