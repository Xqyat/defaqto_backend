const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/defaqto_server')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB is not connected with error:', err));

app.listen(3001, () => console.log('Backend is working: localhost:3001'));