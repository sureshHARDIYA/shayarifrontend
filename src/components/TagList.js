import gql from "graphql-tag";
import unionBy from "lodash/unionBy";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { Table, Popconfirm, Form, Input, Button, message } from "antd";

import {
  // EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const TAG_MUTATION = gql`
  mutation tagMutation($title: String!) {
    createTag(title: $title) {
      id
      title
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

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      error: "",
      loading: true,
      columns: [
        {
          title: "id",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "title",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "Action",
          key: "action",
          render: record => (
            <Popconfirm
              title="Are you sure you want to delete the tag?"
              onConfirm={() => this.handleDelete(record.id)}
            >
              <DeleteOutlined />
            </Popconfirm>
          )
        }
      ]
    };
  }

  componentWillMount() {
    this.props.client
      .mutate({
        mutation: FEED_QUERY
      })
      .then(results => {
        this.setState({
          loading: false,
          rows: results.data.tags
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
        console.log(error);
      });
  }

  onFinish = values => {
    this.props.client
      .mutate({
        mutation: TAG_MUTATION,
        variables: values
      })
      .then(results => {
        this.setState({
          loading: false,
          rows: unionBy(this.state.rows, [results.data.createTag], "title")
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
        console.log(error);
      });
  };

  handleDelete = id => {
    if (id) {
      this.props.client
        .mutate({
          mutation: gql`
            mutation TagMutation($id: ID!) {
              deleteTag(id: $id) {
                id
              }
            }
          `,
          variables: { id: id }
        })
        .then(results => {
          message.success(`Post with ${id} was deleteted Succesfully!`);
          this.setState({
            rows: this.state.rows.filter(item => item.id !== id)
          });
          window.scrollTo(0, 0);
        })
        .catch(error => {
          message.error("Something went wrong. Try again later.");
          console.log(error);
        });
    }
  };

  render() {
    const { columns, rows, loading } = this.state;
    return (
      <div>
        <Form onFinish={this.onFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Tag
            </Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={rows} loading={loading} />
      </div>
    );
  }
}

export default withApollo(TagList);
