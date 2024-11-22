const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MentalHealth = require('../models/MentalHealth');

// 获取用户的心理健康评估记录
router.get('/', auth, async (req, res) => {
  try {
    const assessments = await MentalHealth.find({ userId: req.user.userId })
      .sort({ assessmentDate: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新的心理健康评估
router.post('/', auth, async (req, res) => {
  try {
    const {
      moodScore,
      stressLevel,
      sleepQuality,
      anxietySymptoms,
      depressionSymptoms,
      notes
    } = req.body;
    
    const newAssessment = new MentalHealth({
      userId: req.user.userId,
      moodScore,
      stressLevel,
      sleepQuality,
      anxietySymptoms,
      depressionSymptoms,
      notes,
      recommendations: generateRecommendations(moodScore, stressLevel, sleepQuality)
    });

    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 生成建议
const generateRecommendations = (moodScore, stressLevel, sleepQuality) => {
  const recommendations = [];
  
  if (moodScore < 5) {
    recommendations.push({
      type: 'mood',
      description: '建议进行放松活动，如冥想或轻度运动',
      resources: ['冥想指南', '运动建议']
    });
  }
  
  if (stressLevel > 7) {
    recommendations.push({
      type: 'stress',
      description: '建议寻求专业心理咨询师帮助',
      resources: ['压力管理技巧', '呼吸练习']
    });
  }
  
  if (sleepQuality < 6) {
    recommendations.push({
      type: 'sleep',
      description: '改善睡眠质量的建议',
      resources: ['睡眠指南', '放松音乐']
    });
  }
  
  return recommendations;
};

// 获取评估统计数据
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await MentalHealth.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: null,
          avgMoodScore: { $avg: '$moodScore' },
          avgStressLevel: { $avg: '$stressLevel' },
          avgSleepQuality: { $avg: '$sleepQuality' }
        }
      }
    ]);
    
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 