import React from 'react'
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
import NoMatch from './pages/NoMatch'
import Admin from './admin'
import Home from './pages/Home'
import User from './pages/user/index'
import Common from './common'
import Dynasty from './pages/dynasty'

export default  class IRouter extends React.Component{
    render() {
        return (
           <HashRouter>
               <App>
                  <Switch>
                  <Route path="/" render={() => 
                      <Admin>
                          <Switch>
                            <Route path="/home" component={Home}></Route>
                            <Route path="/user" component={User}></Route>
                            <Route path="/dynasty" component={Dynasty}></Route>
                            <Redirect to="/home" />
                            <Route component={NoMatch}></Route>
                          </Switch>
                      </Admin>
                  }/>
                  </Switch>
               </App>
           </HashRouter>
        )
    }
}