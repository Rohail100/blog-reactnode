var express = require('express');
var router = express.Router();
var pool = require('./db')
var auth = require('./auth')

/*
    POSTS ROUTES SECTION
*/

router.get('/get/allposts', (req, res, next) => {
  pool.query("SELECT * FROM posts ORDER BY date_created DESC", (q_err, q_res) => {
    res.json(q_res.rows)
  })
})


router.post('/post/posttodb',auth, (req, res, next) => {
  const values = [req.body.title, req.body.body, req.body.uid, req.body.username]
  pool.query(`INSERT INTO posts(title, body, user_id, author, date_created)
              VALUES($1, $2, $3, $4, NOW() )`, values, (q_err, q_res) => {
    if (q_err) return next(q_err);
    res.json(q_res.rows)
  })
})

router.put('/put/post',auth, (req, res, next) => {
  const values = [req.body.title, req.body.body, req.body.uid, req.body.pid, req.body.username]
  pool.query(`UPDATE posts SET title= $1, body=$2, user_id=$3, author=$5, date_created=NOW()
              WHERE pid = $4`, values,
    (q_err, q_res) => {
      res.json(q_res)
    })
})

router.delete('/delete/postcomments',auth, (req, res, next) => {
  const post_id = req.body.post_id
  pool.query(`DELETE FROM comments
              WHERE post_id = $1`, [post_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})

router.delete('/delete/post',auth, (req, res, next) => {
  const post_id = req.body.post_id
  pool.query(`DELETE FROM posts WHERE pid = $1`, [post_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})


/*
    COMMENTS ROUTES SECTION
*/


router.post('/post/commenttodb',auth, (req, res, next) => {

  const time = new Date()

  const values = [req.body.comment, req.body.user_id, req.body.username, req.body.post_id, time]

  pool.query(`INSERT INTO comments(comment, user_id, author, post_id, date_created)
              VALUES($1, $2, $3, $4, $5)`, values,
    (q_err, q_res) => {
      pool.query(`SELECT cid FROM comments
                WHERE comment = $1 AND date_created = $2`, [req.body.comment, time],
        (q_err, q_res) => {
          res.json(q_res.rows[0].cid)
          console.log(q_err)
        })
      console.log(q_err)
    })
})

router.put('/put/commenttodb',auth, (req, res, next) => {
  const values = [req.body.comment, req.body.user_id, req.body.post_id, req.body.username, req.body.cid]

  pool.query(`UPDATE comments SET
              comment = $1, user_id = $2, post_id = $3, author = $4, date_created=NOW()
              WHERE cid=$5`, values,
    (q_err, q_res) => {
      res.json(q_res.rows)
      console.log(q_err)
    })
})


router.delete('/delete/comment',auth, (req, res, next) => {
  const cid = req.body.cid

  pool.query(`DELETE FROM comments
              WHERE cid=$1`, [cid],
    (q_err, q_res) => {
      res.json(q_res.rows)
      console.log(q_err)
    })
})


router.get('/get/allpostcomments', (req, res, next) => {
  const post_id = String(req.query.post_id)
  pool.query(`SELECT * FROM comments
              WHERE post_id=$1`, [post_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
      console.log(q_err)
    })
})

/*
  USER PROFILE SECTION
*/

router.post('/posts/userprofiletodb',auth, (req, res, next) => {
  const values = [req.decoded.nickname, req.decoded.email, req.decoded.email_verified]
  pool.query(`INSERT INTO users(username, email, email_verified, date_created)
                VALUES($1, $2, $3, NOW())
                ON CONFLICT DO NOTHING`, values,
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})

router.get('/get/userprofilefromdb', (req, res, next) => {
  const email = req.query.email
  pool.query(`SELECT * FROM users
                WHERE email=$1`, [email],
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})

router.get('/get/userposts', (req, res, next) => {
  const user_id = req.query.user_id
  pool.query(`SELECT * FROM posts
                WHERE user_id=$1`, [user_id],
    (q_err, q_res) => {
      res.json(q_res.rows)
    })
})

module.exports = router