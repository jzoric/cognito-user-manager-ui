import React, {Component} from "react";
import "./App.css";
import {Icon, Layout, Menu} from "antd";
import Login from "./components/auth/Login";
import {UserStorage} from "./helpers";
import {UserPool} from "./components/user-pools/UserPool";

const {Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
    state = {
        collapsed: false,
        authenticatedUser: UserStorage.getUser(),
    };

    onCollapse = collapsed => {
        this.setState({collapsed});
    };


    loginSuccessfulCallback = user => {
        UserStorage.saveUser(user);
        this.setState({authenticatedUser: user});
    };

    loginFailedCallback = response => {
        UserStorage.removeUser();
        console.error("Can't login!", response);
    };

    logout = () => {
        UserStorage.removeUser();
        this.setState({authenticatedUser: null});
    };


    render() {
        if (!this.state.authenticatedUser) {
            return <Login loginSuccessfull={this.loginSuccessfulCallback} loginFailed={this.loginFailedCallback}/>;
        }
        return (
            <Layout style={{minHeight: "100vh"}}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="contacts"/> <span>User pools</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="user"/>
                                     <span>User</span>
                                 </span>
                            }
                        >
                            <Menu.Item key="2" onClick={this.logout}><Icon type="poweroff"/> Logout</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{margin: "0 16px"}}>
                        <UserPool/>
                    </Content>
                    <Footer style={{textAlign: "center"}}>
                        Cognito user manager 2018 (v0.0.1)
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default App;
