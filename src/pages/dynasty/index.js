import React from 'react'
import {Card, Button, Form, Input, Select,Radio, Icon, Modal, DatePicker, Table} from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const storage = window.localStorage;
export default class Dynasty extends React.Component{

    state = {
        list:[],
        isVisible: false
    }

    params = {
        page: 1
    }

    componentDidMount(){
        this.requestList();
    }

    requestList = () => {
        // axios.requestList(this, '/table/list1', this.params);
        let listdata = storage.getItem('dynastydata');
        if (listdata) {
            let list = JSON.parse(listdata);
            list = list.map((item, i) => {
                item.value = i+1;
                return item
            })
            this.setState({
                list: list
            })
        }
    }

    //操作
    handleOperate = (type, item) => {
        if(type == 'create'){
            this.setState({
                type,
                isVisible: true,
                title: '新增朝代',
                userInfo: {}
            })
        }else if(type == 'edit'){
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个朝代'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '编辑',
                userInfo: item
            })
        }else if(type == 'delete'){
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个朝代'
                })
                return;
            }
            let _this = this;
            Modal.confirm({
                title: '确认删除',
                content: `是否要删除当前选中的朝代${item.label}`,
                onOk(){
                    let listdata = storage.getItem('dynastydata');
                    if (listdata) {
                        let list = JSON.parse(listdata)
                        list.splice(list.findIndex(listitem => listitem.label == item.label), 1)
                        list.map((item, i) => {
                            item.value = i+1;
                            return item
                        })
                        _this.setState({
                            list: list
                        }, () => {
                            let liststr = JSON.stringify(list);
                            storage.setItem('dynastydata', liststr);
                        })
                    }
                }
            })
        }
    }

    //提交
    handleSubmit = () => {
        let {type, list, userInfo} = this.state;
        let data = this.userForm.props.form.getFieldsValue();
        this.setState({
            isVisible: false
        })

        if (type == 'create') {
            console.log(data)    
            if (this.state.list.findIndex(listitem => listitem.label == data.label) != -1) {
                alert('该朝代名已存在')
                return
            }

            list.push(data);
            list = list.map((item, i) => {
                item.value = i+1;
                return item
            })
            let liststr = JSON.stringify(list);
            storage.setItem('dynastydata', liststr);
        } else if (type == 'edit') {
            let editlist = list.map(item => {
                if (item.value == userInfo.value) {
                    item = data;
                    item.value = userInfo.value;
                }
                return item
            })
            console.log(editlist)
            this.setState({
                list: editlist
            }, () => {
                let liststr = JSON.stringify(editlist);
                storage.setItem('dynastydata', liststr);
            })
        }
    }

    render(){
        const columns = [
            {
                title: 'ID',
                dataIndex: 'value'
            },
            {
                title: '朝代名称',
                dataIndex: 'label',
                render(label){
                    return label
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, item) => (
                    <div className="operate-wrap">
                        <Button icon="edit" onClick={() => this.handleOperate('edit', item)}>编辑</Button>
                        <Button type="text" icon="delete" onClick={() => this.handleOperate('delete', item)}>删除</Button>
                    </div>
                ),
            }
        ];

        let footer = {};
        if(this.state.type == 'detail'){
            footer = {
                footer: null
            }
        }

        return (
            <div>
                <Card style={{marginTop:10}} className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
                </Card>
                <div className="content-wrap">
                    <Table dataSource={this.state.list} columns={columns} pagination={this.state.pagination} />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit.bind(this)}
                    onCancel={() => {
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={600}
                    {...footer}
                >
                    <UserForm type={this.state.type} list={this.state.list} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => {this.userForm = inst;}}/>
                </Modal>
            </div>
        )
    }
}

//子组件：创建员工表单
class UserForm extends React.Component{

    render(){
        let _this = this;
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const {getFieldDecorator} = this.props.form;
        const formItemLayout= {
            labelCol:{span: 5},
            wrapperCol:{span: 19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="朝代" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.label :
                            getFieldDecorator('label',{
                                initialValue: userInfo.label
                            })(
                                <Input type="text" placeholder="请输入朝代" rules={[{ required: true }]}/>
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm);