// // import { createClient } from '@supabase/supabase-js';

// // const supabaseUrl = "https://zejrdogdkwljvbfsqpyl.supabase.co";
// // const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplanJkb2dka3dsanZiZnNxcHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTMxMTcsImV4cCI6MjA1NDUyOTExN30.VPqsPPxbN6JVak5oc6hvXDwutODnIFh904Cpt2FzHMo";

// // if (!supabaseUrl || !supabaseKey) {
// //   console.error('Missing Supabase URL or Key in environment variables');
// //   process.exit(1);
// // }

// // const supabase = createClient(supabaseUrl, supabaseKey);

// // async function fetchData() {
// //   const { data, error } = await supabase.from('depense').select('*');

// //   if (error) {
// //     console.error('Error fetching data:', error);
// //   } else {
// //     console.log('Data:', data);
// //   }
// // }

// // fetchData();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from the .env file

const supabaseUrl = "https://abhkxtmkpbalxiyhhorh.supabase.co"; //"https://zejrdogdkwljvbfsqpyl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGt4dG1rcGJhbHhpeWhob3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MTgwNTksImV4cCI6MjA1MzI5NDA1OX0.wA8LCZkKw0UJB-fPpC20TOkYv965DfAII7xO4T_mks4"; //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplanJkb2dka3dsanZiZnNxcHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTMxMTcsImV4cCI6MjA1NDUyOTExN30.VPqsPPxbN6JVak5oc6hvXDwutODnIFh904Cpt2FzHMo";

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in environment variables');
  process.exit(1); // Exit if variables are not set
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Add this right after creating the client to test the connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('Connection successful:', data);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

testConnection();

async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('serviceurgence')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No data found in the table');
      return;
    }
    
    console.log('Data:', data);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint
    });
  }
}

fetchData();
