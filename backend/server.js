const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const NotificationService = require('./utils/notifications');
const { createUploadDirectories } = require('./utils/fileUpload');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建上传目录
createUploadDirectories();

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 创建HTTP服务器
const server = http.createServer(app);

// WebSocket设置
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// 初始化通知服务
const notificationService = new NotificationService(io);

// WebSocket连接处理
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('authenticate', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} authenticated`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 将通知服务添加到请求对象中
app.use((req, res, next) => {
  req.notificationService = notificationService;
  next();
});

// 路由
const authRoutes = require('./routes/auth');
const healthDataRoutes = require('./routes/healthData');
const workoutRoutes = require('./routes/workout');
const dietRoutes = require('./routes/diet');
const mentalHealthRoutes = require('./routes/mentalHealth');
const communityRoutes = require('./routes/community');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/health-data', healthDataRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 生产环境下提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 