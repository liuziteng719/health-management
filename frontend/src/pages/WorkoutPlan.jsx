import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Form, Input, Button, Select, 
  TimePicker, Table, Tag, Modal, InputNumber, message 
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../styles/WorkoutPlan.css';

const { Option } = Select;
const { TextArea } = Input;

const WorkoutPlan = () => {
  const [plans, setPlans] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await fetch('/api/workout', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      message.error('获取健身计划失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const url = editingPlan ? `/api/workout/${editingPlan._id}` : '/api/workout';
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success(`${editingPlan ? '更新' : '创建'}健身计划成功`);
        setVisible(false);
        form.resetFields();
        fetchWorkoutPlans();
      }
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/workout/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        message.success('删除成功');
        fetchWorkoutPlans();
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const columns = [
    {
      title: '计划名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (text) => (
        <Tag color={
          text === 'beginner' ? 'green' :
          text === 'intermediate' ? 'orange' : 'red'
        }>
          {text === 'beginner' ? '初级' :
           text === 'intermediate' ? '中级' : '高级'}
        </Tag>
      )
    },
    {
      title: '目标肌群',
      dataIndex: 'targetMuscleGroups',
      key: 'targetMuscleGroups',
      render: (tags) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPlan(record);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            删除
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="workout-plan">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="我的健身计划">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingPlan(null);
                form.resetFields();
                setVisible(true);
              }}
            >
              创建新计划
            </Button>
            <Table 
              columns={columns} 
              dataSource={plans}
              rowKey="_id"
              className="workout-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingPlan ? "编辑健身计划" : "创建健身计划"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="计划描述"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="难度等级"
            rules={[{ required: true, message: '请选择难度等级' }]}
          >
            <Select>
              <Option value="beginner">初级</Option>
              <Option value="intermediate">中级</Option>
              <Option value="advanced">高级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="targetMuscleGroups"
            label="目标肌群"
            rules={[{ required: true, message: '请选择目标肌群' }]}
          >
            <Select mode="multiple">
              <Option value="chest">胸部</Option>
              <Option value="back">背部</Option>
              <Option value="legs">腿部</Option>
              <Option value="shoulders">肩部</Option>
              <Option value="arms">手臂</Option>
              <Option value="core">核心</Option>
            </Select>
          </Form.Item>

          <Form.List name="exercises">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="exercise-card">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="动作名称"
                          rules={[{ required: true, message: '请输入动作名称' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'sets']}
                          label="组数"
                        >
                          <InputNumber min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'reps']}
                          label="次数"
                        >
                          <InputNumber min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Button type="link" danger onClick={() => remove(name)}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    添加动作
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingPlan ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutPlan; 