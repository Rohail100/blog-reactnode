import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom';
import * as ACTIONS from '../store/actions/actions';
import axios from 'axios';
import moment from 'moment';

import { Card, CardContent, CardHeader, Button } from '@material-ui/core';
import Pagination from "react-js-pagination";

class Posts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            opacity: 0,
            posts_motion: [],
            num_posts: 0,
            page_range: 0,
            activePage: 1,
            posts_per_page: 5,
            posts_slice: [],
        }
    }


    componentDidMount() {
        this.handleTransition()
        axios.get('/api/get/allposts')
            .then(res => this.props.set_posts(res.data))
            .then(() => this.init_state())
            .catch((err) => console.log(err))
    }

    handleTransition = () => {
        setTimeout(() => this.setState({ opacity: 1 }), 400)
    }
    init_state = () => {
        this.setState({ num_posts: this.props.posts.length })
        this.setState({ page_range: this.props.num_posts / 5 })
        console.log(this.props.posts)

        this.slice_posts();
        this.animate_posts();
    }

    slice_posts = () => {
        const indexOfLastPost = this.state.activePage * this.state.posts_per_page
        const indexOfFirstPost = indexOfLastPost - this.state.posts_per_page


        this.setState({ posts_slice: this.props.posts.slice(indexOfFirstPost, indexOfLastPost) })
    }

    animate_posts = () => {
        this.setState({ posts_motion: [] })
        let i = 1
        this.state.posts_slice.map(post => {  // eslint-disable-line
            setTimeout(() => { this.setState({ posts_motion: [...this.state.posts_motion, post] }) }, 400 * i);
            i++;
        })
    }

    handlePageChange = (pageNumber) => {
        this.setState({ activePage: pageNumber });
        setTimeout(() => { this.slice_posts() }, 50)
        setTimeout(() => { this.animate_posts() }, 100)
    }

    RenderPosts = post => (
        <Card className="CardStyles">
            <CardHeader
                title={<Link style={{ textDecoration: 'none', color: 'black' }} to={{ pathname: '/post/' + post.post.pid, state: { post } }}>
                    {post.post.title}
                </Link>}
                subheader={
                    <div className="FlexColumn">
                        <div className="FlexRow">
                            {moment(post.post.date_created).format('MMMM Do, YYYY | h:mm a')}
                        </div>
                    </div>
                }
            />
            <CardContent>
                <span className="text"> {post.post.body} </span>
            </CardContent>
        </Card>
    );

    render() {
        return (
            <div>
                <div style={{ opacity: this.state.opacity, transition: 'opacity 2s ease' }}>
                    <br />
                    {this.props.is_authenticated
                        ? <Link to="/addpost">
                            <Button variant="contained" color="primary">
                                Add Post
                            </Button>
                        </Link>
                        : <Link to="/signup">
                            <Button variant="contained" color="primary">
                                Sign Up to Add Post
                            </Button>
                        </Link>
                    }
                </div>
                <div style={{ opacity: this.state.opacity, transition: 'opacity 2s ease' }}>
                    <br />
                    <div>
                        {this.props.posts
                            ? this.state.posts_motion.map(post =>
                                <this.RenderPosts key={post.pid} post={post} />
                            ) : null}
                    </div>
                </div>
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={5}
                    totalItemsCount={this.state.num_posts}
                    pageRangeDisplayed={this.state.page_range}
                    onChange={this.handlePageChange}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    posts: state.posts_reducer.posts,
    is_authenticated: state.auth_reducer.is_authenticated
})

const mapDispatchToProps = (dispatch) => ({
    set_posts: (posts) => dispatch(ACTIONS.fetch_db_posts(posts)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Posts)
