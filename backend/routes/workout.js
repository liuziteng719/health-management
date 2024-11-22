const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WorkoutPlan = require('../models/WorkoutPlan');

// 获取用户的所有健身计划
router.get('/', auth, async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(workoutPlans);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新的健身计划
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, exercises, schedule, difficulty, targetMuscleGroups } = req.body;
    
    const newWorkoutPlan = new WorkoutPlan({
      userId: req.user.userId,
      title,
      description,
      exercises,
      schedule,
      difficulty,
      targetMuscleGroups
    });

    await newWorkoutPlan.save();
    res.status(201).json(newWorkoutPlan);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新健身计划
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, exercises, schedule, difficulty, targetMuscleGroups } = req.body;
    
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        title,
        description,
        exercises,
        schedule,
        difficulty,
        targetMuscleGroups
      },
      { new: true }
    );

    if (!workoutPlan) {
      return res.status(404).json({ message: '健身计划不存在' });
    }

    res.json(workoutPlan);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除健身计划
router.delete('/:id', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!workoutPlan) {
      return res.status(404).json({ message: '健身计划不存在' });
    }

    res.json({ message: '健身计划删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 