const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getDepense = async (req, res) => {
  try {
    const { data, error } = await supabase.from('depense').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setDepense = async (req, res) => {
  try {
    const { description, montant, dateeachecance, paye, etudiant_id } = req.body;
    const { data, error } = await supabase.from('depense').insert([
      { description, montant, dateeachecance, paye, etudiant_id },
    ]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};