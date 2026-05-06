const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  try {
    const token =
      req.get('Authorization')?.replace('Bearer ', '') ||
      req.headers['authorization']?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ error: 'Токен обязателен' });

    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.userId).select('-password');
    if (!admin) return res.status(401).json({ error: 'Админ не найден' });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};