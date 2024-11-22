import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, List, Typography, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import socket from '../utils/socket';
import '../styles/Notifications.css';

const { Text } = Typography;

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // 连接WebSocket
      socket.connect();
      socket.emit('authenticate', user.userId);

      // 监听新通知
      socket.on('notification', (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // 获取历史通知
      fetchNotifications();
    }

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/user/notifications', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('获取通知失败:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await fetch(`/api/user/notifications/${notification._id}/read`, {
          method: 'PUT',
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        setUnreadCount(prev => prev - 1);
        
        // 更新通知状态
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error('标记通知失败:', error);
      }
    }
  };

  const notificationMenu = (
    <List
      className="notification-list"
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={item => (
        <List.Item
          className={`notification-item ${!item.read ? 'unread' : ''}`}
          onClick={() => handleNotificationClick(item)}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>{item.title}</Text>
            <Text type="secondary">{item.message}</Text>
            <Text type="secondary" className="notification-time">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Space>
        </List.Item>
      )}
    />
  );

  return (
    <Dropdown
      overlay={notificationMenu}
      trigger={['click']}
      placement="bottomRight"
      arrow
    >
      <Badge count={unreadCount} className="notification-badge">
        <BellOutlined className="notification-icon" />
      </Badge>
    </Dropdown>
  );
};

export default Notifications; 