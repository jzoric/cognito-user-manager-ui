import React, {Component} from 'react';
import {Button, Form, Icon, Input,message} from 'antd';
import axios from 'axios';
import './Login.css';
import {API_BASE_ENDPOINT} from "../../config";

const FormItem = Form.Item;

class Login extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post(`${API_BASE_ENDPOINT}/signin`,
                    {
                        "username": values.username,
                        "password": values.password
                    })
                    .then(response => this.props.loginSuccessfull({token:response.data.token}))
                    .catch(err => {
                        console.log("ERROR",err);
                        message.error("Wrong credentials!")
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-container">
                <h1>Cognito user manager</h1>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Username"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input your password!'}],
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                   placeholder="Password"/>
                        )}
                    </FormItem>
                    <FormItem> <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button></FormItem>
                </Form>
                <footer>version 0.0.1</footer>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);
export default WrappedLogin;
