const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthData = require('../models/HealthData');

// 获取用户的所有健康数据
router.get('/', auth, async (req, res) => {
  try {
    const healthData = await HealthData.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加新的健康数据记录
router.post('/', auth, async (req, res) => {
  try {
    const { type, value, unit, notes } = req.body;
    
    const newHealthData = new HealthData({
      userId: req.user.userId,
      type,
      value,
      unit,
      notes,
      timestamp: new Date()
    });

    await newHealthData.save();
    res.status(201).json(newHealthData);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取特定类型的健康数据
router.get('/type/:type', auth, async (req, res) => {
  try {
    const healthData = await HealthData.find({
      userId: req.user.userId,
      type: req.params.type
    }).sort({ timestamp: -1 });
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除健康数据记录
router.delete('/:id', auth, async (req, res) => {
  try {
    const healthData = await HealthData.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!healthData) {
      return res.status(404).json({ message: '数据不存在' });
    }

    await healthData.remove();
    res.json({ message: '数据删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新健康数据记录
router.put('/:id', auth, async (req, res) => {
  try {
    const { value, unit, notes } = req.body;
    
    const healthData = await HealthData.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!healthData) {
      return res.status(404).json({ message: '数据不存在' });
    }

    healthData.value = value;
    healthData.unit = unit;
    healthData.notes = notes;

    await healthData.save();
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取健康数据统计信息
router.get('/stats/:type', auth, async (req, res) => {
  try {
    const stats = await HealthData.aggregate([
      {
        $match: {
          userId: req.user.userId,
          type: req.params.type
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$value' },
          max: { $max: '$value' },
          min: { $min: '$value' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 