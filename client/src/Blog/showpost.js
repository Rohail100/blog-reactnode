import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom';
import * as ACTIONS from '../store/actions/actions';
import axios from 'axios';
import moment from 'moment';


import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';


class Showpost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            comment: '',
            cid: '',
            delete_comment_id: 0,
            comments_motion: [],
        }
    }
    componentDidMount() {
        axios.get('/api/get/allpostcomments', {
            params:
                { post_id: this.props.location.state.post.post.pid }
        })
            .then(res => this.props.set_comments(res.data))
            .then(() => this.animate_comments())
            .catch((err) => console.log(err))
    }

    animate_comments = () => {
        let i = 1
        this.props.comments.map(comment => {  // eslint-disable-line
            setTimeout(() => { this.setState({ comments_motion: [...this.state.comments_motion, comment] }) }, 400 * i);
            i++;
        })
    }

    handleCommentSubmit = (submitted_comment) => {
        this.setState({ comments_motion: [...this.state.comments_motion, submitted_comment] })
        window.scrollTo(0, document.body.scrollHeight);
    };

    handleCommentUpdate = (comment) => {
        const commentIndex = this.state.comments_motion.findIndex(com => com.cid === comment.cid)
        let newArr = [...this.state.comments_motion]
        newArr[commentIndex] = comment
        this.setState({ comments_motion: newArr })
    };

    handleCommentDelete = (cid) => {
        this.setState({ delete_comment_id: cid })
        const newArr = this.state.comments_motion.filter(com => com.cid !== cid)
        setTimeout(() => this.setState({ comments_motion: newArr }), 2000)
    };

    RenderComments = (comment) => (
        <div className={this.state.delete_comment_id === comment.comment.cid
            ? "FadeOutComment"
            : "CommentStyles"}>
            <h3>{comment.comment.comment}</h3>
            <small>{moment(comment.comment.date_created).format('MMMM Do, YYYY | h:mm a')}</small>
            <p>{comment.comment.author}</p>
            {comment.cur_user_id === comment.comment.user_id
                ? <Button onClick={() => this.handleClickOpen(comment.comment.cid, comment.comment.comment)}>
                    Edit
                </Button>
                : null
            }
        </div>
    )

    handleClickOpen = (cid, comment) => (
        this.setState({ open: true, comment: comment, cid: cid })
    );

    handleClose = () => (
        this.setState({ open: false, comment: '', cid: '' })
    );

    handleCommentChange = (event) => (
        this.setState({ comment: event.target.value })
    );

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({ comment: '' })

        const comment = event.target.comment.value
        const user_id = this.props.db_profile[0].uid
        const post_id = this.props.location.state.post.post.pid
        const username = this.props.db_profile[0].username
        const current_time = new Date().toISOString();

        const data = {
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }

        axios.post('/api/post/commenttodb', data)
            .then(res => {
                const cid = res.data;
                const submitted_comment = {
                    cid: cid,
                    comment: comment,
                    user_id: user_id,
                    author: username,
                    date_created: current_time
                }
                this.handleCommentSubmit(submitted_comment)
            })
            .catch((err) => console.log(err))
    }
    handleUpdate = () => {
        const comment = this.state.comment
        const cid = this.state.cid
        const user_id = this.props.db_profile[0].uid
        const post_id = this.props.location.state.post.post.pid
        const username = this.props.db_profile[0].username
        const current_time = new Date().toISOString();

        const edited_comment = {
            cid: cid,
            comment: comment,
            user_id: user_id,
            author: username,
            date_created: current_time
        }
        const data = {
            cid: cid,
            comment: comment,
            post_id: post_id,
            user_id: user_id,
            username: username
        }

        axios.put('/api/put/commenttodb', data)
            .then(res => console.log(res))
            .catch((err) => console.log(err))
        this.handleCommentUpdate(edited_comment);
    }
    handleDelete = () => {
        const cid = this.state.cid
        axios.delete('/api/delete/comment', { data: { cid: cid } })
            .then(res => console.log(res))
            .catch((err) => console.log(err))
        this.handleCommentDelete(cid)
    }

    render() {
        return (
            <div>
                <div>
                    <h2>{this.props.location.state.post.post.title}</h2>
                    <p>{this.props.location.state.post.post.body}</p>
                    <p>{this.props.location.state.post.post.author}</p>
                </div>
                <div>
                    <h2>Comments:</h2>
                    {this.props.comments ? this.state.comments_motion.map(comment =>
                        <this.RenderComments
                            comment={comment}
                            key={comment.cid}
                            cur_user_id={this.props.db_profile ? this.props.db_profile[0].uid : null}
                        />) : null}
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            id="comment"
                            label="Comment"
                            margin="normal"
                        />
                        <br />
                        {this.props.is_authenticated
                            ? <Button variant="contained" color="primary" type="submit" >Submit</Button>
                            : <Link to="/signup">
                                <Button variant="contained" color="primary">
                                    Signup to Comment
                                </Button>
                            </Link>
                        }
                    </form>
                </div>
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Edit Comment</DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                id="alert-dialog-description"
                            >
                                <input type="text" value={this.state.comment} onChange={this.handleCommentChange} />
                            </DialogContentText>
                            <DialogActions>
                                <Button onClick={() => { this.handleUpdate(); this.handleClose() }}>
                                    Agree
                                </Button>
                                <Button onClick={() => this.handleClose()}>
                                    Cancel
                                </Button>
                                <Button onClick={() => { this.handleDelete(); this.handleClose() }}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    comments: state.posts_reducer.comments,
    db_profile: state.auth_reducer.db_profile,
    is_authenticated: state.auth_reducer.is_authenticated
})

const mapDispatchToProps = (dispatch) => ({
    set_comments: (comments) => dispatch(ACTIONS.fetch_post_comments(comments))
})

export default connect(mapStateToProps, mapDispatchToProps)(Showpost)
