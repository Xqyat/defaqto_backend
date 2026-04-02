const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = 'defaqto-super-secret-2026';

module.exports = async (req, res, next) => {
  try {
    const token =
      req.get('Authorization')?.replace('Bearer ', '') ||
      req.headers['authorization']?.replace('Bearer ', '');

    console.log('Токен:', token ? token.slice(0, 20) + '...' : 'отсутствует');

    if (!token) return res.status(401).json({ error: 'Токен обязателен' });

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log('DECODED payload:', decoded);
    const allAdmins = await Admin.find({}, '_id login');
    console.log('Все админы в БД>:', allAdmins.map(a => a._id.toString()));

    const admin = await Admin.findById(decoded.userId).select('-password');
    console.log('Ищем ID:', decoded.userId, ' найден:', !!admin);
    if (!admin) return res.status(401).json({ error: 'Админ не найден' });

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};