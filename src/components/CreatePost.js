import { message } from "antd";
import gql from "graphql-tag";
import compose from "lodash/fp/compose";
import React, { Component } from "react";
import { graphql, withApollo } from "react-apollo";

import PostForm from "./forms/postForm";

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

class CreateLink extends Component {
  formRef = React.createRef();

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
        this.props.history.push("/post/new");
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
        <PostForm data={this.props.data} onFinish={this.onFinish} />
      </div>
    );
  }
}

export default compose(graphql(FEED_QUERY), withApollo)(CreateLink);
