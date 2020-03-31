import React, { Component } from 'react'
import { Mutation, graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { Form, Input, Button, Select, message} from 'antd';

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $body: String!, $tags: [String]) {
    addPost(title: $title, body: $body, tags: $tags) {
      id
      body
      title
    }
  }
`
const FEED_QUERY = gql`
  {
    tags {
      id
    title
  }
}
`
const { Option } = Select;

class CreateLink extends Component {
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
        <Mutation
          mutation={POST_MUTATION}
          onCompleted={() => {
            message.success('The shayari was created Succesfully!');
            this.props.history.push('/')}
          }
        >
          {(postMutation, { loading, data }) =>
          <Form onFinish={(values) => {postMutation({variables: values})}} onSubmit={this.onSubmit}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="body" label="Body" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="tags"
                label="Tags"
                hasFeedback
                rules={[{ required: true, message: 'Please select your country!' }]}
              >
                <Select placeholder="Please select a tags" mode="tags">
                 {(Array.isArray(this.props.data.tags) && this.props.data.tags) && this.props.data.tags.map(item => <Option value={item.title} key={item.id}>{item.title}</Option>) }
                </Select>
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

export default graphql(FEED_QUERY)(CreateLink)
