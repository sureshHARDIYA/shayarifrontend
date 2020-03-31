import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Typography, Tag, Card } from "antd";

// const POST_MUTATION = gql`
//   mutation PostMutation($title: String!, $body: String!) {
//     addPost(title: $title, body: $body) {
//       id
//       body
//       title
//     }
//   }
// `;

const POST_QUERY = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      body
      tags {
        id
        title
      }
      owner {
        email
      }
    }
  }
`;

const { Paragraph } = Typography;

class PostEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      data: this.props.data.post
    };
  }

  onSubmit = e => {
    e.preventDefault();
  };

  render() {
    const {
      data: { post }
    } = this.props;
    return (
      <Card style={{ minHeight: 400 }}>
        {post && post.body && (
          <Paragraph editable={{ onChange: this.onChange }}>
            {post.body}
          </Paragraph>
        )}
        {post &&
          post.tags &&
          post.tags.map(item => (
            <Tag color="cyan" key={item.id}>
              {item.title}
            </Tag>
          ))}
      </Card>
    );
  }
}

export default graphql(POST_QUERY, {
  options: ({ match }) => ({
    variables: {
      id: match.params.id
    }
  })
})(PostEdit);
