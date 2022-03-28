import React from 'react';
import Button from '@material-ui/core/Button';

//Home page
const Home = (props) => (
    <div>
      <h1>Welcome to The Blog</h1>
      <h2>Get Started</h2>
      {
      !props.is_authenticated ? 
      <Button color="primary" size="large" variant="contained" onClick={() => props.auth.login()}>
      Signup/Login
    </Button>:
    <Button color="primary" size="large" variant="contained" onClick={() => props.history.replace('/posts')}>
      FORUM
    </Button>
    }
    </div>
);

function mapStateToProps(state) {
  return {
    is_authenticated: state.auth_reducer.is_authenticated
  }
}

export default connect(mapStateToProps)(Home);
