import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import { connect } from 'react-redux';

class EditPost extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      body: ''
    }
  }

  componentDidMount() {
    this.setState({
      title: this.props.location.state.post.post.title,
      body: this.props.location.state.post.post.body
    })
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value })
  }

  handleBodyChange = (event) => {
    this.setState({ body: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const user_id = this.props.db_profile[0].uid
    const username = this.props.db_profile[0].username
    const pid = this.props.location.state.post.post.pid
    const title = event.target.title.value
    const body = event.target.body.value

    const data = {
      title: title,
      body: body,
      pid: pid,
      uid: user_id,
      username: username
    }
    axios.put("/api/put/post", data)
      .then(res => console.log(res))
      .catch(err => console.log(err))
      .then(setTimeout(() => this.props.history.replace('/profile'), 700))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id='title'
            label='title'
            margin="normal"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
          <br />
          <TextField
            id='body'
            label='body'
            multiline
            rows="4"
            margin='normal'
            value={this.state.body}
            onChange={this.handleBodyChange}
          />
          <br />
          <Button type="submit"> Submit </Button>
        </form>
        <br />
        <Button onClick={() => this.props.history.goBack()}> Cancel </Button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    db_profile: state.auth_reducer.db_profile
  }
}

export default connect(mapStateToProps)(EditPost);
