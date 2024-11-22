const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DietPlan = require('../models/DietPlan');

// 获取用户的所有饮食计划
router.get('/', auth, async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新的饮食计划
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, meals, totalCalories, dietaryRestrictions } = req.body;
    
    const newDietPlan = new DietPlan({
      userId: req.user.userId,
      title,
      description,
      meals,
      totalCalories,
      dietaryRestrictions
    });

    await newDietPlan.save();
    res.status(201).json(newDietPlan);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新饮食计划
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, meals, totalCalories, dietaryRestrictions } = req.body;
    
    const dietPlan = await DietPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        title,
        description,
        meals,
        totalCalories,
        dietaryRestrictions
      },
      { new: true }
    );

    if (!dietPlan) {
      return res.status(404).json({ message: '饮食计划不存在' });
    }

    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除饮食计划
router.delete('/:id', auth, async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!dietPlan) {
      return res.status(404).json({ message: '饮食计划不存在' });
    }

    res.json({ message: '饮食计划删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 