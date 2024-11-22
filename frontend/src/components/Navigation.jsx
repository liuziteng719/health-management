import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Drawer } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  HeartOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Notifications from './Notifications';
import '../styles/Navigation.css';

const { Header } = Layout;

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setVisible(false);
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: '首页', path: '/' },
    ...(isAuthenticated ? [
      { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘', path: '/dashboard' },
      { key: 'health-data', icon: <HeartOutlined />, label: '健康数据', path: '/health-data' },
      { key: 'workout', icon: <TeamOutlined />, label: '健身计划', path: '/workout' },
      { key: 'diet', icon: <TeamOutlined />, label: '饮食管理', path: '/diet' },
      { key: 'mental-health', icon: <TeamOutlined />, label: '心理健康', path: '/mental-health' },
      { key: 'community', icon: <TeamOutlined />, label: '社区', path: '/community' },
      { key: 'settings', icon: <SettingOutlined />, label: '设置', path: '/settings' }
    ] : [])
  ];

  const renderMenu = () => (
    <Menu theme="light" mode="horizontal" selectedKeys={[location.pathname]}>
      {menuItems.map(item => (
        <Menu.Item key={item.path} icon={item.icon}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderMobileMenu = () => (
    <Menu theme="light" mode="vertical" selectedKeys={[location.pathname]}>
      {menuItems.map(item => (
        <Menu.Item key={item.path} icon={item.icon} onClick={() => setVisible(false)}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Header className="header">
      <div className="logo">
        <Link to="/">健康管理平台</Link>
      </div>

      {/* 桌面端菜单 */}
      <div className="desktop-menu">
        {renderMenu()}
      </div>

      {/* 移动端菜单按钮 */}
      <Button
        className="mobile-menu-button"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />

      <div className="user-actions">
        {isAuthenticated ? (
          <>
            <Notifications />
            <Avatar icon={<UserOutlined />} />
            <Button type="link" onClick={handleLogout} className="logout-button">
              退出登录
            </Button>
          </>
        ) : (
          <div className="auth-buttons">
            <Button type="link">
              <Link to="/login">登录</Link>
            </Button>
            <Button type="primary">
              <Link to="/register">注册</Link>
            </Button>
          </div>
        )}
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setVisible(false)}
        open={visible}
        className="mobile-drawer"
      >
        {renderMobileMenu()}
        {isAuthenticated && (
          <div className="drawer-footer">
            <Button type="primary" danger block onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        )}
      </Drawer>
    </Header>
  );
};

export default Navigation; 