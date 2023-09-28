const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CarrosselSchema = new Schema({
  title: {type: String, require: true},
  imgs: {type: Array, require: true}
})

module.exports = mongoose.model("Carrossel", CarrosselSchema)