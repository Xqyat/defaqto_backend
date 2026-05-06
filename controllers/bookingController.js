const nodemailer = require('nodemailer');

const sendBookingRequest = async (req, res) => {
  try {
    const { name, phone, date, time, seats, privacyAccepted } = req.body;

    if (!name || !phone || !date || !time || !seats) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    if (!privacyAccepted) {
      return res.status(400).json({ error: 'Подтвердите согласие с политикой' });
    }

    const transporter = nodemailer.createTransport({
      service: 'mail.ru',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO,
      subject: 'Новая заявка на бронирование DeFAQto',
      html: `
        <h2>Новая заявка на бронирование</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Дата:</strong> ${date}</p>
        <p><strong>Время:</strong> ${time}</p>
        <p><strong>Количество гостей:</strong> ${seats}</p>
      `,
    });

    res.status(200).json({ message: 'Заявка отправлена' });
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    res.status(500).json({ error: 'Ошибка сервера при отправке заявки' });
  }
};

module.exports = { sendBookingRequest };