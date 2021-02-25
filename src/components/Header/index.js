import React from 'react'
import { Row, Col } from 'antd'
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios';
import {connect} from 'react-redux'  //连接器

class Header extends React.Component {
    state = {}
    componentWillMount() {
        this.setState({
            userName: '庖丁科技'
        })
        setInterval(() => {
            let sysTime = Util.formatDate(new Date().getTime());
            this.setState({
                sysTime
            })
        }, 1000)
    }
  
    render() {
        const {menuName, menuType} = this.props;
        return (
            <div className="header">
               <Row className="header-top">
                  {
                      menuType ? 
                      <Col span="6" className="logo">
                           <img src="/assets/logo-ant.svg" alt="" />
                           <span>管理系统</span>
                      </Col> : ''
                  }
                  <Col span={menuType ? 18 : 24}>
                      <span>欢迎，{this.state.userName}</span>
                  </Col>
               </Row>
            </div>
        )
    }
}
//将state.menuName 绑定到 props 的menuName
const mapStateToProps = state => {
    return {
        menuName: state.menuName
    }
}
export default connect(mapStateToProps)(Header)