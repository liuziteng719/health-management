const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// 获取用户的所有活动
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ scheduledTime: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新活动
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, duration, scheduledTime, reminder } = req.body;
    
    const newActivity = new Activity({
      userId: req.user.userId,
      type,
      title,
      description,
      duration,
      scheduledTime,
      reminder: {
        enabled: reminder?.enabled || false,
        time: reminder?.time
      }
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新活动状态
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    activity.completed = !activity.completed;
    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除活动
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    await activity.remove();
    res.json({ message: '活动删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取今日活动
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activities = await Activity.find({
      userId: req.user.userId,
      scheduledTime: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ scheduledTime: 1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 