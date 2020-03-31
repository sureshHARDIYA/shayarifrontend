import React, { Component } from "react";
import { Mutation, graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Form, Input, Button, Select, message } from "antd";
import compose from "lodash/fp/compose";

const POST_MUTATION = gql`
  mutation PostMutation($body: String!, $tags: [String]) {
    addPost(body: $body, tags: $tags) {
      id
      body
    }
  }
`;
const FEED_QUERY = gql`
  {
    tags {
      id
      title
    }
  }
`;
const { Option } = Select;

class CreateLink extends Component {
  state = {
    body: ""
  };

  onFinish = values => {
    this.props.client
      .mutate({
        mutation: POST_MUTATION,
        variables: values
      })
      .then(results => {
        message.success("The shayari was created Succesfully!");
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({
          error: error
        });
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Form onFinish={this.onFinish}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <Mutation
          mutation={POST_MUTATION}
          onCompleted={() => {
            message.success("The shayari was created Succesfully!");
            this.props.history.push("/");
          }}
        >
          {(postMutation, { loading, data }) => (
            <Form
              onFinish={values => {
                postMutation({ variables: values });
              }}
              onSubmit={this.onSubmit}
            >
              <Form.Item name="body" label="Body" rules={[{ required: true }]}>
                <Input.TextArea style={{ minHeight: "240px" }} />
              </Form.Item>
              <Form.Item
                name="tags"
                label="Tags"
                hasFeedback
                rules={[
                  { required: true, message: "Please select your country!" }
                ]}
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
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Mutation>
      </div>
    );
  }
}

export default compose(graphql(FEED_QUERY), withApollo)(CreateLink);
