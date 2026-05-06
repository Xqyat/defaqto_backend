const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      date, 
      time, 
      endDate, 
      endTime, 
      entranceType, 
      entrancePrice 
    } = req.body;

    if (!req.file || !name || !description || !date || !time || !endDate || !endTime || !entranceType) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (entranceType === 'paid' && (!entrancePrice || entrancePrice < 0)) {
      return res.status(400).json({ error: 'Укажите корректную цену для платного входа' });
    }

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({ error: 'Дата и время окончания должны быть позже начала события' });
    }

    const expiresAt = endDateTime;

    const imagePath = `/uploads/events/${req.file.filename}`;

    const event = await Event.create({
      img: imagePath,
      name: name.trim(),
      description: description.trim(),
      date: new Date(date),
      time: time.trim(),
      endDate: new Date(endDate),
      endTime: endTime.trim(),
      expiresAt: expiresAt,
      entranceType: entranceType.trim(),
      ...(entranceType === 'paid' && { entrancePrice: Number(entrancePrice) }),
    });

    res.status(201).json({
      id: event._id,
      img: event.img,
      name: event.name,
      description: event.description,
      date: event.date.toISOString().split('T')[0],
      time: event.time,
      endDate: event.endDate.toISOString().split('T')[0],
      endTime: event.endTime,
      entranceType: event.entranceType,
      entrancePrice: event.entrancePrice,
    });
  } catch (err) {
    console.error('Ошибка создания события:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      img, 
      name, 
      description, 
      date, 
      time, 
      endDate, 
      endTime, 
      entranceType, 
      entrancePrice 
    } = req.body;

    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : img;

    if (!imagePath || !name || !description || !date || !time || !endDate || !endTime || !entranceType) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (entranceType === 'paid' && (!entrancePrice || entrancePrice < 0)) {
      return res.status(400).json({ error: 'Укажите корректную цену для платного входа' });
    }

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    if (endDateTime <= startDateTime) {
      return res.status(400).json({ error: 'Дата и время окончания должны быть позже начала события' });
    }

    const expiresAt = endDateTime;

    const updated = await Event.findByIdAndUpdate(
      id,
      {
        img: imagePath,
        name: name.trim(),
        description: description.trim(),
        date: new Date(date),
        time: time.trim(),
        endDate: new Date(endDate),
        endTime: endTime.trim(),
        expiresAt: expiresAt,
        entranceType: entranceType.trim(),
        ...(entranceType === 'paid' && { entrancePrice: Number(entrancePrice) }),
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    res.json({
      id: updated._id,
      img: updated.img,
      name: updated.name,
      description: updated.description,
      date: updated.date.toISOString().split('T')[0],
      time: updated.time,
      endDate: updated.endDate.toISOString().split('T')[0],
      endTime: updated.endTime,
      entranceType: updated.entranceType,
      entrancePrice: updated.entrancePrice,
    });
  } catch (err) {
    console.error('Ошибка обновления события:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    res.json({
      message: 'Событие удалено',
      id: deleted._id,
    });
  } catch (err) {
    console.error('Ошибка удаления события:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
};