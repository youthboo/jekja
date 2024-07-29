const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Item = require('./models/Item');
const { URLSearchParams } = require('url'); // Import URLSearchParams for form data

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Route สำหรับการจัดการข้อความ
app.post('/messages', async (req, res) => {
  try {
    const message = req.body.message;
    const newMessage = await Item.create({
      name: message, // เก็บข้อความใน field name
    });

    // ใช้ dynamic import() สำหรับ node-fetch
    const fetch = (await import('node-fetch')).default;

    // ส่งข้อความไปยัง LINE Notify
    const lineNotifyToken = process.env.LINE_NOTIFY_TOKEN;
    const lineNotifyUrl = 'https://notify-api.line.me/api/notify';

    await fetch(lineNotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineNotifyToken}`,
      },
      body: new URLSearchParams({ message }),
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error:', err); // แสดงข้อผิดพลาดในคอนโซล
    res.status(400).json({ message: err.message });
  }
});

// Route สำหรับการส่งการแจ้งเตือนฉุกเฉิน
app.post('/send-alert', async (req, res) => {
  try {
    const message = req.body.message || 'แจ้งเตือนฉุกเฉิน';

    // ใช้ dynamic import() สำหรับ node-fetch
    const fetch = (await import('node-fetch')).default;

    // ส่งข้อความไปยัง LINE Notify
    const lineNotifyToken = process.env.LINE_NOTIFY_TOKEN;
    const lineNotifyUrl = 'https://notify-api.line.me/api/notify';

    await fetch(lineNotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineNotifyToken}`,
      },
      body: new URLSearchParams({ message }),
    });

    res.status(200).json({ message: 'Alert sent successfully' });
  } catch (err) {
    console.error('Error:', err); // แสดงข้อผิดพลาดในคอนโซล
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

sequelize.sync(); // ทำการซิงค์ฐานข้อมูล
