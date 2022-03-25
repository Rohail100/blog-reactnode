import React from 'react';
import Button from '@material-ui/core/Button';

//Home page
const Home = (props) => (
    <div>
      <h1>Welcome to The Blog</h1>
      <h2>Get Started</h2>
      <Button color="primary" size="large" variant="contained" onClick={() => props.auth.login()}>
      Signup/Login
    </Button>
    </div>
);

export default Home;
