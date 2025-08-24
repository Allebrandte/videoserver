const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect('mongodb://mongo:27017/videoserver', { useNewUrlParser: true, useUnifiedTopology: true });

// Modelos
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'client' }
}));

const Video = mongoose.model('Video', new mongoose.Schema({
  clientId: String,
  filename: String,
  schedule: Object
}));

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Upload de vídeos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Rotas
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, role });
  await user.save();
  res.sendStatus(201);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.sendStatus(401);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id, role: user.role }, 'secret');
  res.json({ token });
});

app.post('/upload', auth, upload.single('video'), async (req, res) => {
  const video = new Video({ clientId: req.user.id, filename: req.file.filename });
  await video.save();
  res.json(video);
});

app.get('/videos', auth, async (req, res) => {
  const videos = await Video.find({ clientId: req.user.id });
  res.json(videos);
});

app.listen(3001, () => console.log('Server running on port 3001'));
