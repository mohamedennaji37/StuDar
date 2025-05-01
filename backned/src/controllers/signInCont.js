import supabase from '../config/supabase.js';

export const setSignInProp = async (req, res) => {
    const { email, password } = req.body;
    
    
    // Check if the owner exists in the proprietaire table
    const { data, error } = await supabase
        .from('proprietaire')
        .select('*')
        .eq('email_pro', email)
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Owner not found' });
    }

    // Validate password (you may want to hash and compare in a real application)
    if (data.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    return res.status(200).json({ success: true, user: data });
}

export const setSignInEtd = async (req, res) => {
    const { email, password } = req.body;

    // Check if the student exists in the etudiant table
    const { data, error } = await supabase
        .from('etudiant')
        .select('*')
        .eq('email_etd', email)
        .single();

    if (error || !data) {
        return res.status(401).json({ success: false, message: 'Student not found' });
    }

    // Validate password (you may want to hash and compare in a real application)
    if (data.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    return res.status(200).json({ success: true, user: data });
}