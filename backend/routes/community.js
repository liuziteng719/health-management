const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');

// 配置文件上传
const storage = multer.diskStorage({
  destination: 'uploads/posts',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 获取所有帖子
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profile.avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 发布新帖子
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const newPost = new Post({
      userId: req.user.userId,
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images
    });

    await newPost.save();
    
    const populatedPost = await Post.findById(newPost._id)
      .populate('userId', 'username profile.avatar');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 点赞/取消点赞
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const likeIndex = post.likes.indexOf(req.user.userId);
    
    if (likeIndex > -1) {
      // 取消点赞
      post.likes.splice(likeIndex, 1);
    } else {
      // 添加点赞
      post.likes.push(req.user.userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加评论
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    post.comments.push({
      userId: req.user.userId,
      content,
      createdAt: new Date()
    });

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username profile.avatar')
      .populate('comments.userId', 'username profile.avatar');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户的所有帖子
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'username profile.avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除帖子
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!post) {
      return res.status(404).json({ message: '帖子不存在或无权限删除' });
    }

    await post.remove();
    res.json({ message: '帖子删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取热门话题
router.get('/topics/hot', auth, async (req, res) => {
  try {
    const hotTopics = await Post.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(hotTopics);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 