import supabase from '../config/supabase.js';

export const getLogements = async (req, res) => {
    const { ville, distance, duree, chambres, prix, Chauffage, WIFI } = req.query;
  
    let query = supabase.from('logement').select('*'); // Ensure the table name is correct
  
    if (ville) query = query.eq('ville', ville);
    if (distance) {
        const distanceNum = Number(distance);
        if (distanceNum === 60) {
            query = query.gte('distance', 60); // Greater than or equal to 60
        } else if (distanceNum > 30) {
            query = query.gt('distance', distanceNum - 10); // Greater than the previous range
        } else {
            query = query.eq('distance', distanceNum);
        }
    }
    if (duree) {
        const dureeNum = Number(duree);
        if (dureeNum === 12) {
            query = query.gte('duree', 12); // Greater than or equal to 12 months
        } else {
            query = query.eq('duree', dureeNum);
        }
    }
    if (chambres) {
        const chameNum = Number(chambres);
        if (chameNum === 4) {
            query = query.gte('chambre', 4); // Greater than or equal to 12 months
        } else {
            query = query.eq('chambre', chameNum);
        }
    }
    if (prix) query = query.lte('prix', Number(prix));
    if (Chauffage) query = query.eq('Chauffage', Chauffage);
    if (WIFI) query = query.eq('WIFI', WIFI);
  
    const { data, error } = await query;
  
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: error.message });
    }
  
    // Directly use the logement_url as the image_url
    const logementsWithImageUrls = data.map(logement => ({
      ...logement,
      //image_url: logement.logement_url
      image_url: [
        logement.logement_url,
        logement.url1,
        logement.url2,
        logement.url3,
        logement.url4,
        logement.url5,
        logement.url6
      ]
    }));
  
    //console.log('img : ' + JSON.stringify(logementsWithImageUrls, null, 2));
    res.status(200).json(logementsWithImageUrls);
};

export const reserveLogement = async (req, res) => {
    const { etudiant_id, logement_id } = req.body; // Expecting these values in the request body

    // Update the etudiant record with the logement_id
    const { data, error } = await supabase
        .from('etudiant')
        .update({ logeEtd_id: logement_id })
        .eq('etudiant_id', etudiant_id);

    if (error) {
        console.error('Error reserving logement:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Reservation successful', data });
};