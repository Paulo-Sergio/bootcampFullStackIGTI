const express = require('express')
const app = express()

const router = require('./routes/router')

global.grades = './data/grades.json'

app.use(express.json())
app.use('/', router)

app.listen(3000, async () => {
  console.log('API Started!!!')
})