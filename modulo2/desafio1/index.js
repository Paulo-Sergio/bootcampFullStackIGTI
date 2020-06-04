const express = require('express')
const fs = require('fs').promises
const app = express()

const router = require('./routes/router')

global.estados = './data/Estados.json'
global.cidades = './data/Cidades.json'

app.use(express.json())
app.use(express.static('data'));
app.use('/', router)

app.listen(3000, async () => {
  console.log('API Started!!!')
})