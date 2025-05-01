import supabase from '../config/supabase.js';

// Fonction pour télécharger un fichier dans Supabase Storage
async function uploadFileToSupabase(file, fileName, bucketName) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,  // Remplacer le fichier s'il existe déjà
    });

  if (error) {
    console.error('Erreur lors de l\'upload:', error);
    return null;
  }

  console.log('Fichier téléchargé avec succès:', data);
  return data;
}

export const setSignUpProp = async (req, res) => {
  try {
      console.log('Requête reçue:', req.body);  // Vérifie les champs texte
      console.log('Fichier reçu:', req.file);   // Vérifie si le fichier est bien présent

      const { prenom_pro, nom_pro, email_pro, numero_pro, date_naissance_pro, password } = req.body;
      const cinFile = req.file;  // Le fichier CIN récupéré

      if (!cinFile) {
          return res.status(400).json({ error: 'Le fichier CIN est manquant.' });
      }

      // Upload du fichier CIN dans Supabase Storage
      const fileName = `${Date.now()}_${cinFile.originalname}`;
      const { data: fileData, error: fileError } = await supabase.storage
          .from('cin-uploads')  // Le nom de ton bucket
          .upload(fileName, cinFile.buffer, {
              contentType: cinFile.mimetype
          });
      console.log("Résultat de l'upload :", fileData, fileError);

      if (fileError) {
          console.error('Erreur lors de l\'upload du CIN:', fileError);
          return res.status(500).json({ error: 'Erreur lors de l\'upload du fichier CIN.' });
      }

      const { data: publicURLData } = supabase.storage.from('cin-uploads').getPublicUrl(fileName);
const publicURL = publicURLData.publicUrl;
      console.log("Public URL du fichier :", publicURL);
      if (!publicURL) {
          return res.status(500).json({ error: "Erreur lors de la récupération de l'URL du fichier CIN." });
      }

      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log("Utilisateur connecté :", user, userError);
      
      if (!user) {
          return res.status(401).json({ error: "Utilisateur non authentifié." });
      }

      // Insérer les données dans la table `proprietaire` avec l'URL du fichier CIN
      const { data, error } = await supabase
          .from('proprietaire')
          .insert([
              { 
                  prenom_pro, nom_pro, email_pro, numero_pro, date_naissance_pro, password, cinFile: publicURL
              }
          ]);

      if (error) {
          console.error('Erreur lors de l\'insertion dans la base:', error);
          return res.status(500).json({ error: error.message });
      }

      res.json({ message: 'Propriétaire ajouté avec succès', data });

  } catch (err) {
      console.error('Erreur serveur:', err);
      res.status(500).json({ error: err.message });
  }
};
  
export const setSignUpEtd = async (req, res) => {
  try {
    const { prenom_etd, nom_etd, email_etd, numero_etd, date_naissance_etd, password } = req.body;
    const cinFile = req.files.cin ? req.files.cin[0] : null;
    const ficheScolariteFile = req.files.fiche_scolarite ? req.files.fiche_scolarite[0] : null;

    if (!cinFile || !ficheScolariteFile) {
      return res.status(400).json({ error: 'Les fichiers sont manquants.' });
    }

    // Upload des fichiers dans Supabase
    const cinFileData = await uploadFileToSupabase(cinFile, `cin/${cinFile.originalname}`, 'cin-uploads');
    const ficheScolariteFileData = await uploadFileToSupabase(ficheScolariteFile, `fiche_scolarite/${ficheScolariteFile.originalname}`, 'fiche-scolarite-uploads');

    if (!cinFileData || !ficheScolariteFileData) {
      return res.status(500).json({ error: 'Erreur lors de l\'upload des fichiers.' });
    }

    const { data: publicURLCinData } = supabase.storage.from('cin-uploads').getPublicUrl(`cin/${cinFile.originalname}`);
    const { data: publicURLScoData } = supabase.storage.from('fiche-scolarite-uploads').getPublicUrl(`fiche_scolarite/${ficheScolariteFile.originalname}`);
    
    const publicURLCin = publicURLCinData?.publicUrl;
    const publicURLSco = publicURLScoData?.publicUrl;

    // Insérer les données dans la table `etudiant`
    const { data, error } = await supabase
      .from('etudiant')
      .insert([{
        prenom_etd,
        nom_etd,
        email_etd,
        numero_etd,
        date_naissance_etd,
        password,
        cinFile: publicURLCin,  // Remplace `cinFile` si la colonne s'appelle `cin`
        fiche_scolarite: publicURLSco
      }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Étudiant ajouté avec succès', data });
  } catch (err) {
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'upload des fichiers.' });
  }
};
