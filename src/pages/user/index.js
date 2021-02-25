import React from 'react'
import {Card, Button, Form, Input, Select,Radio, Icon, Modal, DatePicker, Table} from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const storage = window.localStorage;
export default class User extends React.Component{

    state = {
        list:[],
        isVisible: false,
        dynastyList: [
          {value: 1, label: '唐'},
          {value: 2, label: '宋'},
          {value: 3, label: '元'},
          {value: 4, label: '明'},
          {value: 5, label: '清'},
        ]
    }

    params = {
        page: 1
    }

    componentDidMount(){
        this.requestList();
    }

    requestList = () => {
        let listdata = storage.getItem('listdata');
        if (listdata) {
            let list = JSON.parse(listdata);
            list = list.map((item, i) => {
                item.id = i+1;
                return item
            })
            this.setState({
                list: list
            })
        }
    }

    //操作
    handleOperate = (type, item) => {
        // let item = this.state.selectedItem;
        if(type == 'create'){
           this.setState({
               type,
               isVisible: true,
               title: '新增诗词',
               userInfo: {}
           })
        }else if(type == 'edit'){
           if(!item){
               Modal.info({
                   title: '提示',
                   content: '请选择一个诗词'
               })
               return;
           }
           this.setState({
                type,
                isVisible: true,
                title: '编辑诗词',
                userInfo: item
           })
        }else if(type == 'detail'){
           if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个诗词'
                })
                return;
           } 
           this.setState({
                type,
                isVisible: true,
                title: '诗词详情',
                userInfo: item
           }) 
        }else if(type == 'delete'){
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个诗词'
                })
                return;
           }
           let _this = this;
           Modal.confirm({
               title: '确认删除',
               content: `是否要删除当前选中的诗词${item.userName}`,
               onOk(){
                               let listdata = storage.getItem('listdata');
                               if (listdata) {
                                   let list = JSON.parse(listdata)
                                   list.splice(list.findIndex(listitem => listitem.userName == item.userName), 1)
                                   list.map((item, i) => {
                                       item.id = i+1;
                                       return item
                                   })
                                   _this.setState({
                                       list: list
                                   }, () => {
                                       let liststr = JSON.stringify(list);
                                       storage.setItem('listdata', liststr);
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
                   // data.id = list.length + 1;
                   list.push(data);
                   list = list.map((item, i) => {
                       item.id = i+1;
                       return item
                   })
                   let liststr = JSON.stringify(list);
                   storage.setItem('listdata', liststr);
               } else if (type == 'edit') {
                   let editlist = list.map(item => {
                       if (item.id == userInfo.id) {
                           item = data;
                           item.id = userInfo.id;
                       }
                       return item
                   })
                   console.log(editlist)
                   this.setState({
                       list: editlist
                   }, () => {
                       let liststr = JSON.stringify(editlist);
                       storage.setItem('listdata', liststr);
                   })
               }
    }

    render(){
        const columns = [
          {
            title: '#',
            dataIndex: 'id'
          },
          {
            title: '作者',
            dataIndex: 'userName',
            render(userName){
              return userName
            }
          }, {
            title: '诗句',
            dataIndex: 'address'
          }, {
            title: '朝代',
            dataIndex: 'state',
            render(state){
                let config = {
                    '1':'唐',
                    '2':'宋',
                    '3':'元',
                    '4':'明',
                    '5':'清'
                }
                return config[state];
            }
          }, {
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
                    <UserForm type={this.state.type} dynastyList={this.state.dynastyList} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => {this.userForm = inst;}}/>
                </Modal>
            </div>
        )
    }
}

//子组件：创建员工表单
class UserForm extends React.Component{

    getState = (state) => {
        let config = {
            '1':'唐',
            '2':'宋',
            '3':'元',
            '4':'明',
            '5':'清'
        }
        return config[state];
    }

    render(){
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const {getFieldDecorator} = this.props.form;
        const formItemLayout= {
            labelCol:{span: 5},
            wrapperCol:{span: 19}
        }
        return (
            <Form layout="horizontal">
                  <FormItem label="作者" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.userName :
                            getFieldDecorator('userName',{
                                initialValue: userInfo.userName
                            })(
                                <Input type="text" placeholder="2～10个字之间，仅支持中文"/>
                            )
                        }
                  </FormItem>
                  <FormItem label="诗句" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.address :
                            getFieldDecorator('address',{
                                initialValue: userInfo.address
                            })(
                                <Input type="text" placeholder="诗句，2～20个字之间"/>
                            )
                        }
                  </FormItem>
                  <FormItem label="朝代" {...formItemLayout}>
                        {
                            type == 'detail' ? this.getState(userInfo.state) :
                            getFieldDecorator('state',{
                                initialValue: userInfo.state
                            })(
                                <Select>
                                    {
                                      this.props.dynastyList.map(item => {
                                        return (
                                          <Option value={item.value}>{item.label}</Option>
                                        )
                                      })
                                    }
                                </Select>
                            )
                        }
                  </FormItem>
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm);