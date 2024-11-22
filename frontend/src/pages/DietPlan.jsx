import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Form, Input, Button, Select, 
  InputNumber, Table, Tag, Modal, TimePicker, message 
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../styles/DietPlan.css';

const { Option } = Select;
const { TextArea } = Input;

const DietPlan = () => {
  const [plans, setPlans] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const response = await fetch('/api/diet', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      message.error('获取饮食计划失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const url = editingPlan ? `/api/diet/${editingPlan._id}` : '/api/diet';
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
        message.success(`${editingPlan ? '更新' : '创建'}饮食计划成功`);
        setVisible(false);
        form.resetFields();
        fetchDietPlans();
      }
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '计划名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '总热量',
      dataIndex: 'totalCalories',
      key: 'totalCalories',
      render: (calories) => `${calories} kcal`
    },
    {
      title: '饮食限制',
      dataIndex: 'dietaryRestrictions',
      key: 'dietaryRestrictions',
      render: (restrictions) => (
        <>
          {restrictions?.map(restriction => (
            <Tag key={restriction}>{restriction}</Tag>
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/diet/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        message.success('删除成功');
        fetchDietPlans();
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  return (
    <div className="diet-plan">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="我的饮食计划">
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
              className="diet-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingPlan ? "编辑饮食计划" : "创建饮食计划"}
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
            name="totalCalories"
            label="每日总热量(kcal)"
            rules={[{ required: true, message: '请输入总热量' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dietaryRestrictions"
            label="饮食限制"
          >
            <Select mode="tags" placeholder="添加饮食限制">
              <Option value="无麸质">无麸质</Option>
              <Option value="素食">素食</Option>
              <Option value="低碳水">低碳水</Option>
              <Option value="低脂">低脂</Option>
              <Option value="无乳糖">无乳糖</Option>
            </Select>
          </Form.Item>

          <Form.List name="meals">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="meal-card">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          label="餐次"
                          rules={[{ required: true, message: '请选择餐次' }]}
                        >
                          <Select>
                            <Option value="breakfast">早餐</Option>
                            <Option value="lunch">午餐</Option>
                            <Option value="dinner">晚餐</Option>
                            <Option value="snack">加餐</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'time']}
                          label="时间"
                        >
                          <TimePicker format="HH:mm" style={{ width: '100%' }} />
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
                    添加餐次
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

export default DietPlan; 