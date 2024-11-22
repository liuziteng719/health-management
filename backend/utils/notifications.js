const User = require('../models/User');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  // 发送实时通知
  async sendNotification(userId, notification) {
    try {
      // 保存通知到数据库
      const user = await User.findById(userId);
      if (user) {
        user.notifications = user.notifications || [];
        user.notifications.push({
          ...notification,
          createdAt: new Date()
        });
        await user.save();

        // 通过WebSocket发送实时通知
        this.io.to(userId.toString()).emit('notification', notification);
      }
    } catch (error) {
      console.error('发送通知失败:', error);
    }
  }

  // 发送活动提醒
  async sendActivityReminder(userId, activity) {
    const notification = {
      type: 'activity',
      title: '活动提醒',
      message: `您有一个活动即将开始：${activity.title}`,
      data: { activityId: activity._id }
    };
    await this.sendNotification(userId, notification);
  }

  // 发送健康数据警告
  async sendHealthAlert(userId, data) {
    const notification = {
      type: 'health_alert',
      title: '健康提醒',
      message: `您的${data.type}数据异常，请注意查看`,
      data: { healthDataId: data._id }
    };
    await this.sendNotification(userId, notification);
  }

  // 发送社区互动通知
  async sendCommunityNotification(userId, type, data) {
    const notifications = {
      like: {
        title: '获得点赞',
        message: '有人赞了您的帖子'
      },
      comment: {
        title: '新评论',
        message: '有人评论了您的帖子'
      },
      mention: {
        title: '被提及',
        message: '有人在帖子中提到了您'
      }
    };

    const notification = {
      type: 'community',
      ...notifications[type],
      data
    };
    await this.sendNotification(userId, notification);
  }

  // 标记通知为已读
  async markAsRead(userId, notificationId) {
    try {
      const user = await User.findById(userId);
      if (user && user.notifications) {
        const notification = user.notifications.id(notificationId);
        if (notification) {
          notification.read = true;
          await user.save();
        }
      }
    } catch (error) {
      console.error('标记通知失败:', error);
    }
  }

  // 获取用户未读通知数量
  async getUnreadCount(userId) {
    try {
      const user = await User.findById(userId);
      if (user && user.notifications) {
        return user.notifications.filter(n => !n.read).length;
      }
      return 0;
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      return 0;
    }
  }
}

module.exports = NotificationService; 