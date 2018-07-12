import React, {Component} from 'react';
import {cognitoAttributes, UserStorage} from "../../helpers";
import {Button, Divider, Form, Input, message} from 'antd';
import axios from 'axios';
import uniqby from 'lodash.uniqby';
import {API_BASE_ENDPOINT} from "../../config";

const FormItem = Form.Item;

class UserAttributes extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let userAttributes = [];
                const attributes = values.attributes;
                for (const key in attributes) {
                    const attribute = {
                        "Name": key,
                        "Value": attributes[key]
                    };
                    userAttributes = userAttributes.concat(attribute)
                }

                axios.post(
                    `${API_BASE_ENDPOINT}/update-user-attributes`,
                    {
                        "user_pool_id": this.props.userPoolId,
                        "username": this.props.user.Username,
                        "user_attributes": userAttributes
                    },
                    {
                        headers: {
                            Authorization: UserStorage.getUser().token,
                        }
                    })
                    .then(() => {
                        message.info('UserAttributes is successfully updated!');
                        this.props.onAttributesUpdate();
                    })
                    .catch(err => {
                        message.info("Can't update user!");
                        console.log(err)
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4},
            },
        };

        getFieldDecorator('userAttr', {initialValue: this.props.user.UserAttributes});
        const attributes = getFieldValue('userAttr');
        const combined = uniqby([...attributes, ...cognitoAttributes], 'Name');
        const formItems = combined.map((attribute, index) => {
            if (attribute.Name === "sub" || attribute.Name === "email_verified" || attribute.Name === "email") {
                return;
            }
            return (
                <FormItem
                    {...formItemLayout}
                    label={attribute.Name}
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(`attributes[${attribute.Name}]`, {
                        initialValue: attribute.Value,
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: false,
                            whitespace: true,
                        }],
                    })(
                        <Input style={{width: '60%', marginRight: 8}}/>
                    )}
                </FormItem>
            );
        });

        return (
            <div style={{padding: 24, background: "#fff", minHeight: 360}}>
                <h2>Update User Attributes</h2>
                <Divider/>
                <Form onSubmit={this.handleSubmit}>
                    {formItems}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit">Update</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const UserAttributesWrapper = Form.create()(UserAttributes);
export default UserAttributesWrapper