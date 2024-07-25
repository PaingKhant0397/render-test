require('dotenv').config()
console.log('home')
const express = require('express');
const mongoose = require('mongoose')
const Note = require('./models/note')
console.log('sdf')
const app = express()
app.use(express.json());

app.use(express.static('dist'))

const cors = require('cors');
app.use(cors())


const morgan = require('morgan');
morgan.token('post-data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))



let notes = [
  {
    "id": "1",
    "content": "HTML is easy",
    "important": true
  },
  {
    "id": "2",
    "content": "Browser can execute only JavaScript",
    "important": false
  },
  {
    "id": "3",
    "content": "GET and POST are the most important methods of HTTP protocol",
    "important": false
  },
]

app.get('/', (req, res) => {
  res.send("<h1>welcome to note application!</h1>")
});

// get all notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})


// get single note
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

// delete note 
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const generateId = () => {
  const max = 10000
  return String(Math.floor(Math.random() * max))
}



// add note 
app.post('/api/notes', (req, res) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: "content is missing" })
  }
  const note = {
    "id": generateId(),
    ...body
  }
  notes = notes.concat(note)
  res.json(note)
})

// handle unknown endpoints 
const unknownEndpoints = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoints)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
