import React, { Component } from "react";
import { AUTH_TOKEN } from "../constants";
import { Layout, Form, Input, Button } from "antd";
import { LOGINURL } from "../config";

const { Content, Footer } = Layout;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

class Logins extends Component {
  state = {
    notice: "",
    type: "tab2",
    autoLogin: true
  };

  onFinish = async values => {
    const log = await fetch(LOGINURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const { token } = await log.json();

    this._saveUserData(token);
    this.props.history.push(`/`);
  };

  onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  render() {
    const { login } = this.state;
    return (
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    );
  }
}

export default Logins;
