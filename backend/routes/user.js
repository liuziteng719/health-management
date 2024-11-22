const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// 配置头像上传
const storage = multer.diskStorage({
  destination: 'uploads/avatars',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 获取用户信息
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户基本信息
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, gender, age, height, weight, medicalHistory } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.profile = {
      ...user.profile,
      name,
      gender,
      age,
      height,
      weight,
      medicalHistory: medicalHistory ? medicalHistory.split(',').map(item => item.trim()) : []
    };

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户头像
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传头像文件' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.profile.avatar = req.file.path;
    await user.save();
    
    res.json({ avatar: user.profile.avatar });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改密码
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码错误' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.json({ message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新通知设置
router.put('/notifications', auth, async (req, res) => {
  try {
    const { exerciseReminder, medicationReminder, communityNotifications } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.settings = {
      ...user.settings,
      notifications: {
        exerciseReminder,
        medicationReminder,
        communityNotifications
      }
    };

    await user.save();
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户健康目标
router.get('/goals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.healthGoals);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加健康目标
router.post('/goals', auth, async (req, res) => {
  try {
    const { type, goal, targetDate } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.healthGoals.push({
      type,
      goal,
      targetDate,
      status: 'active'
    });

    await user.save();
    res.json(user.healthGoals);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 