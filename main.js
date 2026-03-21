const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'defaqto-super-secret-2026';

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

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.replace('Bearer ', '') || 
                req.headers['authorization']?.replace('Bearer ', '');

    console.log('Токен:', token ? token.slice(0, 20) + '...' : 'отсутствует');

    if (!token) return res.status(401).json({ error: 'Токен обязателен' });

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log('DECODED payload:', decoded);
    const allAdmins = await adminSchema.find({}, '_id login');
    console.log('Все админы в БД>:', allAdmins.map(a => a._id.toString()));
    const admin = await adminSchema.findById(decoded.userId).select('-password');
    console.log('Ищем ID:', decoded.userId, ' найден:', !!admin);
    if (!admin) return res.status(401).json({ error: 'Админ не найден' });
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

app.post('/api/admin/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    console.log('Входяший LOGIN:', login);
  console.log('Входяший PASSWORD:', password);

console.log('Все админы:', await adminSchema.find({}, 'login'));
    
    const admin = await adminSchema.findOne({ login });

    console.log('Админ из БД:', admin ? admin.login : 'не найден');

    if (!admin) return res.status(401).json({ error: 'Неверный логин' });

    console.log('Проверка пароля:', admin.password, '==', password);

    if (admin.password !== password) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ userId: admin._id.toString() }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      admin: { id: admin._id, login: admin.login }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Успех!', 
    admin: req.admin 
  });
});

app.listen(3001, () => console.log('Backend is working: localhost:3001'))
