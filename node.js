const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'docs/.vuepress/dist')))
module.exports = app