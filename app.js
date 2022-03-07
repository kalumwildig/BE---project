const express = require('express')
const {customError, PSQLErrors} = require('./controllers/errorcontroller')
const apiRouter = require('./routes/apiRouter')
const cors = require('cors')
const app = express()

app.use(cors());

app.use(express.json())
app.use('/api', apiRouter)


//ERRORS
app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use(customError);
app.use(PSQLErrors);

module.exports = app