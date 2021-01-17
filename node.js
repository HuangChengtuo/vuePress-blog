const express = require('express')
const path = require('path')

const app = express()

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "docs/.vuepress/dist/index.html"))
})

app.use(express.static(path.join(__dirname, 'docs/.vuepress/dist')))
const port = 80
app.listen(port, () => console.log(`Example app listening on port ${port}!`))