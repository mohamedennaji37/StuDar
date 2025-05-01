import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour télécharger un fichier dans Supabase Storage
async function uploadFileToSupabase(file, bucketName) {
  console.log('Uploading file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  const fileName = `logement/${uuidv4()}_${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error('Erreur lors de l\'upload:', error.message);
    return null;
  }

  // Construct the public URL
  const publicUrl = `https://imztgmrftncrdnhwjmgu.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;
  console.log('Uploaded file name:', publicUrl);

  return publicUrl; // Return the public URL instead of the internal path
}

// --------------------------------------------------------ADD LOGEMENT--------------------------------------------------------
export const addLogement = async (req, res) => {
  const { nom_dep, Description_log, ville, prix, WIFI, Chauffage, chambre, distance, duree } = req.body;

  // Validate the incoming data
  if (!nom_dep || !Description_log || !ville || !prix || !chambre || !distance ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log('Incoming request body:', req.body); // Log incoming request body for debugging

  const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {});

  // Flatten the files array
  const flattenedFiles = files.flat();
  console.log('Flattened files:', flattenedFiles);  // Log the flattened files array
  // Log the structure of each file object after initialization
  files.forEach(fileArray => {
    fileArray.forEach(file => {
        console.log('File object:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
    });
  });

  console.log('Incoming files:', files); // Log incoming files for debugging

  try {
    console.log('Files to upload:', flattenedFiles); // Log the files being uploaded
    // Upload des fichiers images dans Supabase
    const uploadPromises = flattenedFiles.map(file => uploadFileToSupabase(file, 'url_logement')).filter(Boolean);
    if (uploadPromises.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const imagePaths = await Promise.all(uploadPromises);

    // Compléter avec null si moins de 7 images
    while (imagePaths.length < 7) {
      imagePaths.push(null);
    }

    console.log('Image paths:', imagePaths);

    // Assignation des URL des fichiers téléchargés
    const [logement_url, url1, url2, url3, url4, url5, url6] = imagePaths;

    // Log the assigned URLs
    console.log('Assigned URLs:', {
        logement_url,
        url1,
        url2,
        url3,
        url4,
        url5,
        url6
    });
    
    // Insertion des données dans la table logement
    const { data, error } = await supabase
      .from('logement')
      .insert([
        {
          nom_dep,
          Description_log,
          ville,
          prix,
          WIFI,
          Chauffage,
          chambre,
          distance,
          duree,
          logement_url,
          url1,
          url2,
          url3,
          url4,
          url5,
          url6,
        }
      ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'House added successfully', data });
  } catch (error) {
    console.error('Erreur serveur:', error.message); // Log the error message for better debugging
    return res.status(500).json({ error: 'Erreur lors de l\'ajout du logement' }); // Return error response
  }
};

// --------------------------------------------------------SELECT LOGEMENTS--------------------------------------------------------
export const getLogements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('logement')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// --------------------------------------------------------DELETE LOGEMENT--------------------------------------------------------
export const deleteLogement = async (req, res) => {
  console.log('Received DELETE request with body:', req.body); // Log the request body

  const { id } = req.body;

  try {
    const { data, error } = await supabase
      .from('logement')
      .delete()
      .eq('logement_id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'House deleted successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// --------------------------------------------------------UPDATE LOGEMENT--------------------------------------------------------
export const updateLogement = async (req, res) => {
  // Log the incoming request body for debugging
  console.log('Incoming update data:', req.body);

  const { logement_id, nom_dep, Description_log, ville, prix, WIFI, Chauffage, chambre, distance, duree } = req.body;

  // Handle file uploads
  const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {});
  const flattenedFiles = files.flat();

  try {
    // Upload new images if provided
    const uploadPromises = flattenedFiles.map(file => uploadFileToSupabase(file, 'url_logement')).filter(Boolean);
    const imagePaths = await Promise.all(uploadPromises);

    // Assign URLs for the uploaded images
    const [logement_url, url1, url2, url3, url4, url5, url6] = imagePaths;

    // Update the logement record
    const { data, error } = await supabase
      .from('logement')
      .update({
        nom_dep,
        Description_log,
        ville,
        prix,
        WIFI,
        Chauffage,
        chambre,
        distance,
        duree,
        logement_url,
        url1,
        url2,
        url3,
        url4,
        url5,
        url6,
      })
      .eq('logement_id', logement_id);
      console.log('Update result:', { data, error });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'House updated successfully', data });
  } catch (error) {
    console.error('Error during update:', error.message);
    res.status(500).json({ error: error.message });
  }
};