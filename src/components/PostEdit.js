import React, { Component } from 'react'
import { Mutation, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Form, Input, Button } from 'antd';

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $body: String!) {
    addPost(title: $title, body: $body) {
      id
      body
      title
    }
  }
`

const POST_QUERY = gql`
query getPost($id: ID!){
    post(id: $id), {
        id
        title
        body
        owner {
            email
        }
    }
}
`


class PostEdit extends Component {
  state = {
    title: '',
    body: '',
  }

  onSubmit = (e) => {
   e.preventDefault()
  }

  render() {

    return (
      <div>
        {console.log(this.props)}
        <Mutation
          mutation={POST_MUTATION}
          onCompleted={() => this.props.history.push('/')}
        >
          {(postMutation, { loading, data }) =>
          <Form onFinish={(values) => {postMutation({variables: values})}} onSubmit={this.onSubmit}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="body" label="Body" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                <Button type="primary"  htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>}
        </Mutation>
      </div>
    )
  }
}

export default graphql(POST_QUERY, {
 options: ({ match }) => ({
  variables: {
   id: match.params.id
  }
 })
})(PostEdit)
