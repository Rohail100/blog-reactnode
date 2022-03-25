import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


class Header extends Component {

  render() {
    return(
        <div style={{padding: '20px',width:'100%',textAlign:'center',backgroundColor:'black'}}>
          <Link to='/' style={linkStyle}>
            Home
          </Link>
          <Link to='/profile' style={linkStyle}>
            Profile
          </Link>
          <Link to='/posts' style={linkStyle}>
             Forum
          </Link>
          {!this.props.is_authenticated
            ? <button onClick={() => this.props.auth.login()}>Login</button>
            : <button onClick={() => this.props.auth.logout()}>Logout</button>
          }
        </div>
    )}
}
const linkStyle = {padding: '10px',color:'white',textDecoration:'none'}

function mapStateToProps(state) {
  return {
    is_authenticated: state.auth_reducer.is_authenticated
  }
}

export default connect(mapStateToProps)(Header);
