import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Table,
  message 
} from 'antd';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import '../styles/HealthData.css';

const { Option } = Select;

const HealthData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟的健康数据
  const healthRecords = [
    {
      id: 1,
      type: 'weight',
      value: 70,
      unit: 'kg',
      date: '2024-01-28',
      notes: '早晨空腹'
    },
    {
      id: 2,
      type: 'bloodPressure',
      value: '120/80',
      unit: 'mmHg',
      date: '2024-01-28',
      notes: '午休后'
    }
  ];

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix()
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const types = {
          weight: '体重',
          bloodPressure: '血压',
          heartRate: '心率',
          bloodSugar: '血糖'
        };
        return types[text] || text;
      }
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => `${text} ${record.unit}`
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes'
    }
  ];

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // TODO: 调用API保存健康数据
      message.success('数据记录成功！');
      form.resetFields();
    } catch (error) {
      message.error('记录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-data">
      <Row gutter={[16, 16]}>
        {/* 数据录入表单 */}
        <Col xs={24} lg={8}>
          <Card title="记录健康数据">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="type"
                label="数据类型"
                rules={[{ required: true, message: '请选择数据类型' }]}
              >
                <Select placeholder="选择要记录的数据类型">
                  <Option value="weight">体重</Option>
                  <Option value="bloodPressure">血压</Option>
                  <Option value="heartRate">心率</Option>
                  <Option value="bloodSugar">血糖</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="value"
                label="数值"
                rules={[{ required: true, message: '请输入数值' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="notes"
                label="备注"
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  记录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 数据展示表格 */}
        <Col xs={24} lg={16}>
          <Card title="历史记录">
            <Table
              columns={columns}
              dataSource={healthRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HealthData; 