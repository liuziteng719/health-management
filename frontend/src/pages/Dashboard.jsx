import React from 'react';
import { Row, Col, Card, Statistic, Progress, Calendar, Timeline } from 'antd';
import { 
  HeartOutlined, 
  WalkerOutlined, 
  ClockCircleOutlined,
  FireOutlined 
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // 体重趋势数据示例
  const weightData = [
    { date: '2024-01-01', value: 70 },
    { date: '2024-01-07', value: 69.5 },
    { date: '2024-01-14', value: 69 },
    { date: '2024-01-21', value: 68.8 },
    { date: '2024-01-28', value: 68.5 },
  ];

  const weightConfig = {
    data: weightData,
    xField: 'date',
    yField: 'value',
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
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        {/* 健康指标卡片 */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日步数"
              value={8888}
              prefix={<WalkerOutlined />}
              suffix="步"
            />
            <Progress percent={74} showInfo={false} strokeColor="#FF7F50" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="心率"
              value={75}
              prefix={<HeartOutlined />}
              suffix="bpm"
            />
            <Progress percent={65} showInfo={false} strokeColor="#FF7F50" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="睡眠时长"
              value={7.5}
              prefix={<ClockCircleOutlined />}
              suffix="小时"
            />
            <Progress percent={85} showInfo={false} strokeColor="#FF7F50" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="消耗热量"
              value={2345}
              prefix={<FireOutlined />}
              suffix="kcal"
            />
            <Progress percent={78} showInfo={false} strokeColor="#FF7F50" />
          </Card>
        </Col>

        {/* 体重趋势图 */}
        <Col xs={24} lg={16}>
          <Card title="体重趋势">
            <Line {...weightConfig} />
          </Card>
        </Col>

        {/* 今日待办 */}
        <Col xs={24} lg={8}>
          <Card title="今日待办">
            <Timeline>
              <Timeline.Item color="green">晨跑 5公里</Timeline.Item>
              <Timeline.Item color="red">量血压</Timeline.Item>
              <Timeline.Item color="blue">服用维生素</Timeline.Item>
              <Timeline.Item color="gray">瑜伽课程</Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        {/* 运动日历 */}
        <Col xs={24}>
          <Card title="运动日历">
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 