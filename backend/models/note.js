/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
// import mongoose
const mongoose = require('mongoose')

// define the schema
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// transform the output of id from object to string
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Note', noteSchema)
