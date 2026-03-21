const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path');

const app = express()

app.use(express.json())
app.use(cors())

app.use('/assets', express.static(path.join(__dirname, 'assets')));

mongoose.connect('mongodb://localhost:27017/defaqto_server')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB is not connected with error:', err))


const adminSchema = mongoose.model('admins', new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  }
}, { timestamps: true }));

const menuItemSchema = mongoose.model('menu_items', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    get: v => Math.round(v * 100) / 100
  },
  weight: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  group: {
    type: String,
    required: true,
    enum: ['food', 'drinks']
  }
} ,
  {timestamps: true}
))

const eventSchema = mongoose.model('events', new mongoose.Schema({
  img: {
    type: String,
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  entrance: {
    type: String,
    required: true
  }
}, {
  timestamps: true  
  }))

app.get('/api/menu', async (req, res) => {
  const data = await menuItemSchema .find()

  const result = {
    food: {},
    drinks: {}
  }

  data.forEach(item => {
      const groupData = item.group === 'food' ? result.food : result.drinks
      const category = item.category || 'other'
      if (!groupData[category]){groupData[category] = { title: category, items: [] }} 
      
      groupData[category].items.push({
      id: item._id,
      name: item.name,
      price: item.price,
      weight: item.weight || '100г'
    })
  })
  res.json(result)
})

app.get('/api/events', async (req, res) => {
  const data = await eventSchema .find()
  res.json(data.map(event => ({
    id: event._id.toString(),           
    img: event.img,
    name: event.name,
    description: event.description,
    date: event.date,
    time: event.time,
    entrance: event.entrance
  })));
});

app.listen(3001, () => console.log('Backend is working: localhost:3001'))
