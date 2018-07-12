import React, {Component} from 'react'
import {Divider, Icon, Modal, Select, Table} from "antd";
import {UserStorage} from "../../helpers";
import axios from "axios/index";
import {API_BASE_ENDPOINT} from "../../config";
import UserDetails from "./UserAttributes";

const Option = Select.Option;

export class UserPool extends Component {
    state = {
        users: [],
        pools: [],
        activeUserPool: null,
        modalVisible: false,
        selectedUser: null
    };

    toggleEnabled = async (username) => {
        try {
            await axios.post(`${API_BASE_ENDPOINT}/users/${username}/enabled`,
                {
                    "user_pool_id": this.state.activeUserPool,
                }, {
                    headers: {
                        Authorization: UserStorage.getUser().token,
                    }
                });
            const users = await this._fetchUsers(this.state.activeUserPool);
            this.setState({users});
        } catch (e) {
            console.log("ERROR", e)
        }
    };

    async componentDidMount() {
        axios.post(
            `${API_BASE_ENDPOINT}/list-pools`,
            {}, {
                headers: {
                    Authorization: UserStorage.getUser().token,
                }
            }).then(response => {
            const pools = response.data;
            this.setState({pools})
        }).catch(err => console.log("ERROR", err));
    }

    _fetchUsers = async (userPoolId) => {
        const users = await axios.post(`${API_BASE_ENDPOINT}/list-users`, {
            "user_pool_id": userPoolId
        }, {
            headers: {
                Authorization: UserStorage.getUser().token,
            }
        });
        return users.data.map((user, index) => {
            return {
                key: index,
                attributes: user.Attributes,
                username: user.Username,
                created: user.UserCreateDate,
                status: user.UserStatus,
                modified: user.UserLastModifiedDate,
                enabled: user.Enabled ? 'enabled' : 'disabled',
            }
        });
    };

    handleChange = async (userPoolId) => {
        const users = await this._fetchUsers(userPoolId);
        this.setState({users, activeUserPool: userPoolId});
    };

    openModal = async (e, username) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_ENDPOINT}/user-details`,
                {
                    "user_pool_id": this.state.activeUserPool,
                    "username": username
                },
                {
                    headers: {
                        Authorization: UserStorage.getUser().token,
                    }
                });
            this.setState({
                selectedUser: response.data,
                modalVisible: true
            })
        } catch (e) {
            console.log("Can't get user: ", e)
        }
    };

    closeModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    onAttributesUpdate = async () => {
        const users = await this._fetchUsers(this.state.activeUserPool);
        this.setState({
            modalVisible: false,
            users
        });
    };

    render() {
        const columns = [
            {
                title: "Username",
                dataIndex: "username",
                key: "username",
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
            },
            {
                title: "Created",
                dataIndex: "created",
                key: "created"
            },
            {
                title: "Modified",
                dataIndex: "modified",
                key: "modified"
            },
            {
                title: "Enabled",
                dataIndex: "enabled",
                key: "enabled"
            },
            {
                title: "Action",
                key: "action",
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={(e) => this.openModal(e, record.username)}> <Icon
                                style={{fontSize: 21, color: '#08c'}} type="edit"/></a>
                            <Divider type="vertical"/>
                            <a onClick={() => {
                                this.toggleEnabled(record.username)
                            }}>
                                {record.enabled === "enabled" ? <Icon style={{ fontSize: 21 }} type="lock"/> : <Icon style={{ fontSize: 21 }} type="unlock"/>}
                                </a>
                        </span>
                    )
                }
            }
        ];
        return (
            <div>

                <div style={{padding: 24, background: "#fff", minHeight: 360}}>
                    <Select placeholder="Select User Pool" style={{width: 200, marginBottom: 10}}
                            onChange={this.handleChange}>
                        {this.state.pools.map((pool, index) => <Option key={index}
                                                                       value={pool.Id}>{pool.Name}</Option>)}
                    </Select>
                    <Table pagination={false} columns={columns} dataSource={this.state.users}/>
                    <Modal
                        title={this.state.selectedUser ? this.state.selectedUser.Username : ""}
                        destroyOnClose={true}
                        visible={this.state.modalVisible}
                        onCancel={this.closeModal}
                        footer={null}
                    >
                        <UserDetails userPoolId={this.state.activeUserPool} user={this.state.selectedUser}
                                     onAttributesUpdate={this.onAttributesUpdate}/>
                    </Modal>
                </div>
            </div>
        )
    }
}