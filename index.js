import express from 'express';
import path from 'path';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import errorMiddleware from './middlewares/errorMiddleware.js';
import connectDatabase from './config/database.js';
import ErrorHandler from './utils/errorHandler.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import logger from './config/logger.js';
import httpStatus from 'http-status';
import http from 'http';
import { Server } from 'socket.io';
import userModel from './models/user.js';

// no __dirname in ES6 module scope, that's why i am using path.resolve()
config({ path: path.join(path.resolve(), 'config/config.env') });

// initializing express applicaiton
const app = express();

// creating http raw server
const server = http.createServer(app);

// set security http headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// connect database
connectDatabase();

// initializing passport
app.use(passport.initialize());

// health check route
app.get('/', (req, res) => {
    res.status(httpStatus.OK).json({
        msg: 'server is working fine!',
        success: true,
    });
});

// api routes
app.use('/auth', authRoutes);
app.use('/message', messageRoutes);

// initializing socket protocol
export const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
});

let onlineUsers = [];

io.on('connection', async (socket) => {
    // console.log('user connected');

    socket.on('addNewUser', (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({ userId, socketId: socket.id });
        // console.log(onlineUsers);
    });

    io.emit('getOnlineUsers', onlineUsers);

    // socket.on('receive', (result) => {
    //     console.log(result);
    // });

    socket.on('sendMessage', (data) => {
        const user = onlineUsers.find((user) => user.userId == data.to);
        if (user) {
            io.to(user.socketId).emit('receiveMessage', data.conversation);
        }
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
    });
});
// 404 error middleware
app.use((req, res, next) => {
    logger.error('NotFound Error');
    next(new ErrorHandler(httpStatus.NOT_FOUND, 'Route Not Found'));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
    logger.info('server is running on http://localhost:' + PORT)
);
