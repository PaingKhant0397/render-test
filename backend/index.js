require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')
const Note = require('./models/note')

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
app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => next(error))
})


// get single note
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      next(error)
    })
  // const note = notes.find(note => note.id === id)
  // if (note) {
  //   res.json(note)
  // } else {
  //   res.status(404).end()
  // }
})

// delete note 
app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
  // notes = notes.filter(note => note.id !== id)
  // res.status(204).end()
})

const generateId = () => {
  const max = 10000
  return String(Math.floor(Math.random() * max))
}

//Update note 

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
// add note 
app.post('/api/notes', (req, res, next) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: "content is missing" })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))

  // const note = {
  //   "id": generateId(),
  //   ...body
  // }
  // notes = notes.concat(note)
  // res.json(note)
})

// handle unknown endpoints 
const unknownEndpoints = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoints)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
