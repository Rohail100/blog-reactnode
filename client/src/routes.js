import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './containers/header';
import Profile from './containers/profile';
import Callback from './functional/callback';
import SignUp from './functional/signup';
import Home from './functional/home';
import Posts from './Blog/posts';
import AddPost from './Blog/addpost';
import ShowPost from './Blog/showpost';
import EditPost from './Blog/editpost';
import * as ACTIONS from './store/actions/actions';
import Auth from './utils/auth';
import AuthCheck from './utils/authcheck';
import axios from 'axios';


import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';




export const auth = new Auth()

const handleAuthentication = (props) => {
  if (props.location.hash) {
    auth.handleAuth(props.history)
  }
}

const PrivateRoute = ({ component: Component, auth }) => (
  <Route render={props => auth.isAuthenticated() === true
    ? <Component auth={auth} {...props} />
    : <Redirect to={{ pathname: '/signup' }} />
  }
  />
)


class Routes extends Component {
  set_db_profile = (profile) => {
    axios.get('/api/get/userprofilefromdb', { params: { email: profile.profile.email } })
      .then(res => this.props.set_db_profile(res.data))
  }
  componentDidMount() {
    if (auth.isAuthenticated()) {
      this.props.login_success()
      auth.getProfile(() => {
        this.props.add_profile(auth.userProfile)
        this.set_db_profile(auth.userProfile)
      })
    }
    else {
      this.props.login_failure()
      this.props.remove_profile()
      this.props.remove_db_profile()
    }
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Header auth={auth} />
            <div className='paddingPage'>
              <Switch>
                <Route exact path='/' render={props => <Home auth={auth} {...props} />} />
                <Route path='/authcheck' render={props => <AuthCheck auth={auth} {...props} />} />
                <Route path='/signup' render={props => <SignUp auth={auth} {...props} />} />
                <Route path='/posts' component={Posts} />
                <Route path='/post/:pid' component={ShowPost} />
                <Route path='/editpost/:pid' component={EditPost} />
                <Route path='/addpost' component={AddPost} />
                <Route path='/callback' render={(props) => { handleAuthentication(props); return <Callback /> }} />
                <PrivateRoute path="/profile" auth={auth} component={Profile} />
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return {
    login_success: () => dispatch(ACTIONS.login_success()),
    login_failure: () => dispatch(ACTIONS.login_failure()),
    add_profile: (profile) => dispatch(ACTIONS.add_profile(profile)),
    remove_profile: () => dispatch(ACTIONS.remove_profile()),
    set_db_profile: (profile) => dispatch(ACTIONS.set_db_profile(profile)),
    remove_db_profile: () => dispatch(ACTIONS.remove_db_profile())
  }
}


export default connect(null, mapDispatchToProps)(Routes);
