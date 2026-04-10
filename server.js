import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize, { User, HealthLog } from './server/db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'eatnfit-v4-secret-key-antigravity';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register attempt:', req.body.email);
    const { name, email, mobile, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { 
      [sequelize.Sequelize.Op.or]: [{ email }, { mobile }]
    } });
    
    if (existingUser) {
       console.log('User already exists:', email);
       return res.status(400).json({ error: 'Email or Mobile already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Register success:', email);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.identifier);
    const { identifier, password } = req.body; 
    
    const user = await User.findOne({ 
      where: {
        [sequelize.Sequelize.Op.or]: [{ email: identifier }, { mobile: identifier }]
      }
    });

    if (!user) {
      console.log('User not found:', identifier);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', identifier);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Login success:', identifier);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, hasOnboarded: !!user.age } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- USER ROUTES ---

// Get Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [HealthLog]
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile (Onboarding)
app.post('/api/user/update', authenticateToken, async (req, res) => {
  try {
    const { age, weight, height, region, goal } = req.body;
    await User.update({ age, weight, height, region, goal }, { where: { id: req.user.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HEALTH LOG ROUTES ---

// Log Health Data
app.post('/api/health/log', authenticateToken, async (req, res) => {
  try {
    const { weight, calories, protein, date } = req.body;
    const log = await HealthLog.create({ 
      userId: req.user.id, 
      weight, 
      calories, 
      protein, 
      date: date || new Date().toISOString().split('T')[0]
    });
    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`EatNFit V4 Backend running on http://localhost:${PORT}`);
  });
});
