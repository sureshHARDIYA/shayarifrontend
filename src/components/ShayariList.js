import gql from "graphql-tag";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { Table, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const FEED_QUERY = gql`
  {
    posts {
      id
      body
      createdAt
      owner {
        email
      }
      tags {
        title
      }
    }
  }
`;

class ShayariList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      loading: true,
      error: "",
      columns: [
        {
          title: "id",
          dataIndex: "id",
          key: "id",
          render: text => <Link to={`/post/${text}`}>{text}</Link>
        },
        {
          title: "body",
          dataIndex: "body",
          key: "body"
        },
        {
          title: "Tags",
          key: "tags",
          dataIndex: "tags",
          width: 250,
          render: tags => (
            <span>
              {tags.map(tag => {
                let color = tag.length > 5 ? "geekblue" : "green";

                if (tag.title === "romantic") {
                  color = "magenta";
                }

                return (
                  <Tag color={color} key={tag}>
                    {tag.title.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )
        },
        {
          title: "Created At",
          key: "createdAt",
          dataIndex: "createdAt",
          render: record => moment.unix(record).format("MM.DD.YYYY")
        },
        {
          title: "Action",
          key: "action",
          width: 90,
          render: record => (
            <span>
              <Link style={{ marginRight: 16 }} to={record.id}>
                <EditOutlined />
              </Link>
              <Popconfirm
                title="Are you sure you want to delete the post?"
                onConfirm={() => this.handleDelete(record.id)}
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
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
          rows: results.data.posts
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error
        });
        console.log(error);
      });
  }

  handleDelete = id => {
    if (id) {
      this.props.client
        .mutate({
          mutation: gql`
            mutation PostMutation($id: ID!) {
              deletePost(id: $id) {
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
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const columns = this.state.columns.map(col => {
      if (col.title === "body") {
        col["sorter"] = (a, b) => a.body.localeCompare(b.body);
        col["sortDirections"] = ["descend", "ascend"];
      }

      return {
        ...col,
        onCell: record => ({
          record,
          title: col.title
        })
      };
    });

    return (
      <Table
        columns={columns}
        dataSource={this.state.rows}
        loading={this.state.loading}
      />
    );
  }
}

export default withApollo(ShayariList);
