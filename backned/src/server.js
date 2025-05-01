import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import signUpRoutes from './routes/signUpRt.js';
import offreRt from './routes/offreRt.js';
import ajouteHomeRt from './routes/ajouteHomeRt.js';
import signInRoutes from './routes/signInRt.js';
dotenv.config();

// Initialize express
const app = express();
// app.use(cors()); // Pour autoriser les requêtes cross-origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase configuration

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate Supabase credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

//Middleware to test Supabase connection
app.use(async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('Supabase connection successful', data);
    next();
  } catch (error) {
    console.error('Supabase connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, '../../frontend/src')));

// Serve static files from the frontend/photo directory
app.use('/photo', express.static(path.join(__dirname, '../../frontend/photo')));

//Serve index.html at root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/index.html'));
});

app.use('/signup', signUpRoutes);// Route to handle sign up requests
app.use('/offre', offreRt);
app.use('/api',ajouteHomeRt);
app.use('/signin', signInRoutes);// Route to handle sign in requests



// Route to fetch all emergency services
app.get('/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('serviceurgence')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    message: err.message
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

export default app;