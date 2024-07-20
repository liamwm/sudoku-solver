const express = require('express')
const app = express()


app.use(express.static("dist"))
app.get('/', function (req, res) {
  res.render("dist/index.html")
})

app.listen(3000)