import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Form, Input, Button, Slider, 
  Select, List, Tag, Progress, message 
} from 'antd';
import { Line } from '@ant-design/charts';
import { 
  SmileOutlined, 
  MehOutlined, 
  FrownOutlined 
} from '@ant-design/icons';
import '../styles/MentalHealth.css';

const { TextArea } = Input;
const { Option } = Select;

const MentalHealth = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAssessments();
    fetchStats();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/mental-health', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      message.error('获取评估记录失败');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/mental-health/stats', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('/api/mental-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('评估提交成功');
        form.resetFields();
        fetchAssessments();
        fetchStats();
      }
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (score) => {
    if (score >= 7) return <SmileOutlined style={{ color: '#52c41a' }} />;
    if (score >= 4) return <MehOutlined style={{ color: '#faad14' }} />;
    return <FrownOutlined style={{ color: '#f5222d' }} />;
  };

  const chartConfig = {
    data: assessments,
    xField: 'assessmentDate',
    yField: 'moodScore',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <div className="mental-health">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="心理健康评估">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="moodScore"
                label="当前心情评分"
                rules={[{ required: true, message: '请评分' }]}
              >
                <Slider
                  marks={{
                    0: '很差',
                    5: '一般',
                    10: '很好'
                  }}
                  min={0}
                  max={10}
                />
              </Form.Item>

              <Form.Item
                name="stressLevel"
                label="压力水平"
                rules={[{ required: true, message: '请评估压力水平' }]}
              >
                <Slider
                  marks={{
                    0: '无压力',
                    5: '中等',
                    10: '极大压力'
                  }}
                  min={0}
                  max={10}
                />
              </Form.Item>

              <Form.Item
                name="sleepQuality"
                label="睡眠质量"
                rules={[{ required: true, message: '请评估睡眠质量' }]}
              >
                <Slider
                  marks={{
                    0: '很差',
                    5: '一般',
                    10: '很好'
                  }}
                  min={0}
                  max={10}
                />
              </Form.Item>

              <Form.Item
                name="anxietySymptoms"
                label="焦虑症状"
              >
                <Select mode="multiple" placeholder="选择当前存在的焦虑症状">
                  <Option value="worry">过度担忧</Option>
                  <Option value="restless">坐立不安</Option>
                  <Option value="concentration">注意力难以集中</Option>
                  <Option value="sleep">睡眠问题</Option>
                  <Option value="fatigue">疲劳</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="notes"
                label="其他说明"
              >
                <TextArea rows={4} placeholder="请描述您的其他感受..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  提交评估
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="统计数据">
            <div className="stats-item">
              <span>平均心情评分</span>
              <Progress
                percent={stats.avgMoodScore * 10}
                format={() => stats.avgMoodScore?.toFixed(1)}
                strokeColor="#FF7F50"
              />
            </div>
            <div className="stats-item">
              <span>平均压力水平</span>
              <Progress
                percent={stats.avgStressLevel * 10}
                format={() => stats.avgStressLevel?.toFixed(1)}
                strokeColor="#FF7F50"
              />
            </div>
            <div className="stats-item">
              <span>平均睡眠质量</span>
              <Progress
                percent={stats.avgSleepQuality * 10}
                format={() => stats.avgSleepQuality?.toFixed(1)}
                strokeColor="#FF7F50"
              />
            </div>
          </Card>

          <Card title="历史评估" className="history-card">
            <List
              dataSource={assessments}
              renderItem={item => (
                <List.Item>
                  <div className="assessment-item">
                    <div className="assessment-header">
                      <span>{new Date(item.assessmentDate).toLocaleDateString()}</span>
                      {getMoodIcon(item.moodScore)}
                    </div>
                    {item.anxietySymptoms?.map(symptom => (
                      <Tag key={symptom}>{symptom}</Tag>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="心情趋势">
            <Line {...chartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MentalHealth; 