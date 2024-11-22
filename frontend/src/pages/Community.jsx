import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  Avatar, 
  List, 
  Tag, 
  Modal, 
  Form,
  message 
} from 'antd';
import { 
  LikeOutlined, 
  MessageOutlined, 
  UserOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Community.css';

const { TextArea } = Input;

const Community = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟的社区帖子数据
  const posts = [
    {
      id: 1,
      author: '健康达人',
      avatar: null,
      title: '每日健身打卡',
      content: '今天完成了5公里跑步和力量训练，感觉状态不错！',
      tags: ['运动', '健身'],
      likes: 23,
      comments: 5,
      createdAt: '2024-01-28'
    },
    {
      id: 2,
      author: '营养师小王',
      avatar: null,
      title: '健康饮食小贴士',
      content: '分享一些适合减重期间的营养餐搭配方案...',
      tags: ['饮食', '营养'],
      likes: 45,
      comments: 12,
      createdAt: '2024-01-27'
    }
  ];

  const handlePost = async (values) => {
    try {
      setLoading(true);
      // TODO: 调用API发布帖子
      message.success('发布成功！');
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          {/* 发帖按钮 */}
          <Card className="post-card">
            <Button 
              type="primary" 
              block 
              onClick={() => setVisible(true)}
            >
              分享你的健康故事
            </Button>
          </Card>

          {/* 帖子列表 */}
          <List
            itemLayout="vertical"
            size="large"
            dataSource={posts}
            renderItem={post => (
              <Card className="post-item" key={post.id}>
                <List.Item
                  actions={[
                    <span><LikeOutlined /> {post.likes}</span>,
                    <span><MessageOutlined /> {post.comments}</span>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={post.title}
                    description={
                      <div>
                        <span className="post-author">{post.author}</span>
                        <span className="post-date">{post.createdAt}</span>
                      </div>
                    }
                  />
                  <div className="post-content">{post.content}</div>
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <Tag key={tag} color="orange">{tag}</Tag>
                    ))}
                  </div>
                </List.Item>
              </Card>
            )}
          />
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} md={8}>
          <Card title="热门话题">
            <List
              size="small"
              dataSource={['健康饮食', '运动健身', '心理健康', '睡眠改善']}
              renderItem={item => (
                <List.Item>
                  <Tag color="orange"># {item}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 发帖模态框 */}
      <Modal
        title="发布新帖子"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePost}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={4} placeholder="分享你的健康故事..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Input placeholder="添加标签，用逗号分隔" />
          </Form.Item>

          <Form.Item>
            <Button icon={<PictureOutlined />}>
              添加图片
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Community; 