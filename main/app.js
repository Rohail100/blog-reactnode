var express = require('express');
var path = require('path');
var apiRouter = require('./routes')

var app = express();

// api routes

app.use(express.json());
app.use('/api',apiRouter)

// Double Duty 
app.use(express.static(path.join(__dirname, "/../client", "build")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/../client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))