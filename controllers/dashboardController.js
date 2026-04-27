const Event = require('../models/Event');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

const dashboardController = async (req, res) => {
  try {
    const [eventsCount, itemsCount, categoriesCount] = await Promise.all([
      Event.estimatedDocumentCount(),
      MenuItem.estimatedDocumentCount(),
      Category.estimatedDocumentCount(),
    ]);

    res.json({
      eventsCount,
      itemsCount,
      categoriesCount,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Не удалось получить данные дэшборда',
      details: error.message,
    });
  }
};

module.exports = {
  dashboardController,
};