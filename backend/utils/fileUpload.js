const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const createUploadDirectories = () => {
  const directories = ['avatars', 'posts'];
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, `../uploads/${dir}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.baseUrl.includes('user') ? 'avatars' : 'posts';
    const uploadPath = path.join(__dirname, `../uploads/${type}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型！'), false);
  }
};

// 创建上传中间件
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

module.exports = {
  createUploadDirectories,
  upload
}; 