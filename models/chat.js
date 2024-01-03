import { model, Schema } from 'mongoose';

const chatSchema = new Schema({
    chat_name: {
        type: String,
    },
    is_group_chat: {
        type: Boolean,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    last_message: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
});

const chatModel = model('Chat', chatSchema);

export default chatModel;
