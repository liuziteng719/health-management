import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography } from 'antd';
import { 
  HeartOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  LineChartOutlined 
} from '@ant-design/icons';
import '../styles/Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="home">
      <header className="hero-section">
        <Title level={1}>健康生活，从这里开始</Title>
        <Paragraph className="hero-description">
          专业的健康管理平台，为您提供全方位的健康解决方案
        </Paragraph>
        <Button type="primary" size="large" className="get-started-btn">
          <Link to="/register">立即开始</Link>
        </Button>
      </header>
      
      <section className="features-section">
        <Row gutter={[24, 24]} className="feature-cards">
          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card" hoverable>
              <HeartOutlined className="feature-icon" />
              <Title level={3}>健康数据追踪</Title>
              <Paragraph>
                记录并分析您的体重、血压、心率等健康指标
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card" hoverable>
              <TeamOutlined className="feature-icon" />
              <Title level={3}>社区互动</Title>
              <Paragraph>
                加入健康社区，分享经验，获得专业建议
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card" hoverable>
              <CalendarOutlined className="feature-icon" />
              <Title level={3}>智能提醒</Title>
              <Paragraph>
                定制化的运动、服药提醒，帮您养成健康习惯
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="data-visualization">
        <Title level={2}>数据可视化展示</Title>
        <Row gutter={[24, 24]}>
          <Col span={24} lg={12}>
            <Card className="chart-card">
              <LineChartOutlined className="chart-icon" />
              <div className="chart-placeholder">
                健康趋势图表展示区域
              </div>
            </Card>
          </Col>
          <Col span={24} lg={12}>
            <Card className="stats-card">
              <div className="stats-content">
                <Title level={4}>平台数据</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="stat-item">
                      <span className="stat-number">10000+</span>
                      <span className="stat-label">活跃用户</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="stat-item">
                      <span className="stat-number">500+</span>
                      <span className="stat-label">专业医生</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default Home; 