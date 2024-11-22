import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Upload, 
  message,
  Divider,
  InputNumber 
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined,
  BellOutlined,
  LockOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Settings.css';

const { Option } = Select;

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      // TODO: 调用API更新用户信息
      message.success('个人信息更新成功！');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {/* 个人信息设置 */}
          <Card title="个人信息" className="settings-card">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.profile?.name,
                gender: user?.profile?.gender,
                age: user?.profile?.age,
                height: user?.profile?.height,
                weight: user?.profile?.weight
              }}
              onFinish={handleProfileUpdate}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                  >
                    <Select>
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="age"
                    label="年龄"
                  >
                    <InputNumber min={1} max={120} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="height"
                    label="身高(cm)"
                  >
                    <InputNumber min={1} max={300} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="weight"
                    label="体重(kg)"
                  >
                    <InputNumber min={1} max={500} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="medicalHistory"
                label="病史记录"
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 账户安全设置 */}
          <Card title="账户安全" className="settings-card">
            <Form layout="vertical">
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度至少6位' }
                ]}
              >
                <Input.Password prefix={<SafetyCertificateOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary">
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* 通知设置 */}
          <Card title="通知设置" className="settings-card">
            <div className="notification-setting">
              <span>运动提醒</span>
              <Switch defaultChecked />
            </div>
            <Divider />
            <div className="notification-setting">
              <span>服药提醒</span>
              <Switch defaultChecked />
            </div>
            <Divider />
            <div className="notification-setting">
              <span>社区消息</span>
              <Switch defaultChecked />
            </div>
          </Card>

          {/* 头像设置 */}
          <Card title="头像设置" className="settings-card">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/api/upload"
              beforeUpload={file => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('只能上传JPG/PNG格式的图片！');
                }
                return isJpgOrPng;
              }}
            >
              {user?.profile?.avatar ? (
                <img src={user.profile.avatar} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传头像</div>
                </div>
              )}
            </Upload>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings; 