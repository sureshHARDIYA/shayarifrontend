import React from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import { Switch, Route } from 'react-router-dom'
import CreateLink from './components/CreatePost'
import PostEdit from './components/PostEdit'
import TagList from './components/TagList'
import ShayariList from './components/ShayariList'
import Login from './components/Login'
import './App.css'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { getToken, deleteToken } from './token'

const { Header, Sider, Content, Footer } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { location } = this.props;
    const isLoggedIn = !!getToken();

    if (!isLoggedIn) {
      return (
        <Switch>
          <Route exact path="/" component={Login} />
        </Switch>
      )
    }

    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={[location.pathname]}>
            <Menu.Item key="1">
              <Link to="/"><UserOutlined />
              <span>Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
            <Link to="/post/new">
              <VideoCameraOutlined />
              <span>New Shayari</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
            <Link to="/tag/new">
              <UploadOutlined />
              <span>New Tag</span>
              </Link>
            </Menu.Item>
            {isLoggedIn && (
              <Menu.Item key="1" onClick={() => {
                deleteToken()
                this.props.history.push("/")
              }}><LogoutOutlined /> Logout</Menu.Item>
            )
          }
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              height: "calc(100vh - 180px)"
            }}
          >

          {isLoggedIn && <Switch>
              <Route exact path="/" component={ShayariList} />
              <Route exact path="/post/new" component={CreateLink} />
              <Route exact path="/tag/new" component={TagList} />
              <Route exact path="/post/:id" component={PostEdit} />
            </Switch>
          }
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(App);
