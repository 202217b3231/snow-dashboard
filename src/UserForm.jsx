import React from "react";
import { DatePicker, Form, Input, Button, Tooltip } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
import { UserOutlined } from "@ant-design/icons";

export default function UserForm({
  handleInputChange,
  addUser,
  clearData,
  copyData,
  form,
  cancelAction,
  setForm,
}) {
  const handleDateChange = (dates) => {
    setForm({
      ...form,
      startDate: dates ? dates[0].format("YYYY-MM-DD") : "",
      endDate: dates ? dates[1].format("YYYY-MM-DD") : "",
    });
  };

  return (
    <Form className="form" onFinish={addUser} layout="inline">
      <Form.Item>
        <Tooltip title="Enter the user ID">
          <Input
            size="large"
            className="input"
            name="id"
            value={form.id}
            onChange={handleInputChange}
            placeholder="User ID"
            prefix={<UserOutlined />}
          />
        </Tooltip>
      </Form.Item>
      <Form.Item>
        <Tooltip title="Select the date range">
          <RangePicker
            size="large"
            className="input"
            value={[
              form.startDate ? moment(form.startDate) : null,
              form.endDate ? moment(form.endDate) : null,
            ]}
            onChange={handleDateChange}
          />
        </Tooltip>
      </Form.Item>
      <div className="buttons">
        <Form.Item>
          <Tooltip title="Add the user">
            <Button size="large" htmlType="submit" type="primary">
              Add User
            </Button>
          </Tooltip>
        </Form.Item>
        <Form.Item>
          <Tooltip title="Clear all data">
            <Button size="large" onClick={clearData}>
              Clear Data
            </Button>
          </Tooltip>
        </Form.Item>
        <Form.Item>
          <Tooltip title="Copy the data">
            <Button size="large" onClick={copyData}>
              Copy Data
            </Button>
          </Tooltip>
        </Form.Item>
      </div>
    </Form>
  );
}
