const jwt = require('jsonwebtoken')
const fs = require('fs');
var pool = require('./db')


//Middleware Checks the token
const auth = (req, res, next) => {
    const publicKey = fs.readFileSync(__dirname + '/key.pem', { encoding: "utf8" });

    const token = req.headers.token
    if (!token) return res.status(401).send('access denied')

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) return res.status(400).send('Invalid token')
        const username = decoded.nickname
        // user autherizaton due to the key is public
        pool.query(`SELECT username FROM users
                      WHERE username=$1`, [username],
            (q_err, q_res) => {
                if(req.url=='/posts/userprofiletodb') {
                    req.decoded = decoded
                    next()
                }
                if (q_res.rows[0])
                    next()
                else
                    return res.status(401).send('access denied')
            })
    })
}

module.exports = auth;