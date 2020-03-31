import React from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

class PostForm extends React.Component {
  formRef = React.createRef();

  onFinish = values => {
    this.props.onFinish(values);
    this.formRef.current.resetFields();
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  render() {
    return (
      <Form onFinish={this.onFinish} ref={this.formRef}>
        <Form.Item name="body" label="Body" rules={[{ required: true }]}>
          <Input.TextArea style={{ minHeight: "240px" }} />
        </Form.Item>
        <Form.Item
          name="tags"
          label="Tags"
          hasFeedback
          rules={[{ required: true, message: "Please select your country!" }]}
        >
          <Select placeholder="Please select a tags" mode="tags">
            {Array.isArray(this.props.data.tags) &&
              this.props.data.tags &&
              this.props.data.tags.map(item => (
                <Option value={item.title} key={item.id}>
                  {item.title}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ float: "right" }}>
          <Button size="large" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default PostForm;
