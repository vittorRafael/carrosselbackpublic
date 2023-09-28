const express = require('express')
const router = require('./routes')
const cors = require('cors');
const path = require('path')
const app = express()

require('dotenv').config()
require('../db/dbConfig')
app.use('/public', express.static('public'))

app.use(cors());
app.use(express.json())
app.use(router)

app.listen(process.env.PORT || 3000)