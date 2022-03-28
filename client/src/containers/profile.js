import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as ACTIONS from '../store/actions/actions';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { Paper, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      post_id: null
    }
  }

  componentDidMount() {
    const user_id = this.props.db_profile[0].uid
    axios.get('/api/get/userposts', { params: { user_id: user_id } })
      .then((res) => this.props.set_user_posts(res.data))
      .catch((err) => console.log(err))
  }

  handleClickOpen = (pid) => {
    this.setState({open: true, post_id: pid })
  }

  handleClickClose = () => {
    this.setState({open: false, post_id: null })
  }

  RenderProfile = (props) => (
    <div>
      <h1>{props.profile.profile.nickname}</h1>
      <br />
      <img src={props.profile.profile.picture} alt="" />
      <br />
      <h4> {props.profile.profile.email}</h4>
      <br />
      <h5> {props.profile.profile.name} </h5>
      <br />
      <h6> Email Verified: </h6>
      {props.profile.profile.email_verified ? <p>Yes</p> : <p>No</p>}
      <br />
    </div>
  )

  RenderPosts = post => (
    <Card className="CardStyles">
      <CardHeader
        title={<Link to={{ pathname: '/post/' + post.post.pid, state: { post } }}>
          {post.post.title}
        </Link>}
        subheader={
          <div className="FlexColumn">
            <div className="FlexRow">
            {  moment(post.post.date_created).format('MMMM Do, YYYY | h:mm a') }
            </div>
            <div className="FlexRow">
              <Link to={{ pathname: '/editpost/' + post.post.pid, state: { post } }}>
                <button>
                  Edit
                </button>
              </Link>
              <button onClick={() => this.handleClickOpen(post.post.pid)}>
                Delete
              </button>
            </div>
          </div>
        }
      />
      <CardContent>
        <span className="text"> {post.post.body} </span>
      </CardContent>
    </Card>
  );

  
  DeltePost = () => {
    const post_id = this.state.post_id
    axios.delete('api/delete/postcomments', {data: { post_id: post_id }, headers: {'token': localStorage.getItem('id_token')}} )
      .then(() => axios.delete('/api/delete/post', {data: { post_id: post_id }, headers: {'token': localStorage.getItem('id_token')}} )
          .then(res => console.log(res) ) )
      .catch(err => console.log(err))
      .then(() => this.handleClickClose())
      .then(() => setTimeout(() => this.props.history.go(0), 700 ) )
  }



  render() {
    return (
      <div>
        <div>
          <this.RenderProfile profile={this.props.profile} />
        </div>
        <Paper>
          {this.props.user_posts
            ? this.props.user_posts.map(post =>
              <this.RenderPosts post={post} key={post.pid} />)
            : null}
        </Paper>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"> Confirm Delete? </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                >
                  Deleteing Post
                </DialogContentText>
                <DialogActions>
                  <Button onClick={() => this.DeltePost() }>
                    Agree
                  </Button>
                  <Button onClick={() => this.handleClickClose()}>
                    Cancel
                  </Button>
              </DialogActions>
            </DialogContent>
        </Dialog>
      </div>

    )
  }
}


function mapStateToProps(state) {
  return {
    profile: state.auth_reducer.profile,
    user_posts: state.posts_reducer.user_posts,
    db_profile: state.auth_reducer.db_profile
  }
}

function mapDispatchToProps(dispatch) {
  return {
    set_user_posts: (posts) => dispatch(ACTIONS.fetch_user_posts(posts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);