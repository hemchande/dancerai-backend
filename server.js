const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const aiReportRoutes = require('./routes/aiReports');
const auth = require('./middleware/auth');

const app = express();

const router = express.Router();




const PORT = process.env.PORT || 8000;


router.use(cors({
  origin: 'http://localhost:3000', // Set the allowed origin for requests http://localhost:3000 https://connectarts-frontend-2.onrender.com
  credentials: true
}));

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');// http://localhost:3000 https://connectarts-frontend-2.onrender.com
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Middleware
// app.use(cors( {
//   origin: 'http://localhost:3000', // or function for multiple origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
//   credentials: true, // if you need to send cookies or HTTP auth
// }));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));
router.options('*', cors(corsOptions));




// MongoDB Connection with proper options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hemchande:He10072638@cluster0.r51ez.mongodb.net/danceai?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



router.get('/', (req, res) => {
  res.send('CORS is set!');
});

// Public routes (no auth required)
router.use('/auth', authRoutes);

// Protected routes (auth required)
router.use('/chat', auth, chatRoutes);
router.use('/ai-reports', auth, aiReportRoutes);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request entity too large' });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Export the Express API
module.exports = router;