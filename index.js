const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// CORS
const cors = require('cors');
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Route pour poster un commentaire
app.post('/comments', (req, res) => {
  const newComment = req.body; // { content: "Comment content" }

  // Lire les commentaires existants
  fs.readFile('comments.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }

    const comments = JSON.parse(data.toString() || '[]');
    newComment.id = comments.length + 1; // Ajouter un ID simple basé sur la longueur du tableau
    comments.push(newComment);

    // Sauvegarder le nouveau tableau de commentaires
    fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        res.status(500).send('Error writing file');
      } else {
        res.status(201).send('Comment added');
      }
    });
  });
});

// Route pour récupérer tous les commentaires
app.get('/comments', (req, res) => {
  fs.readFile('comments.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }

    const comments = JSON.parse(data.toString() || '[]');
    res.json(comments);
  });
});

// Route pour modifier un commentaire
app.put('/comments/:id', (req, res) => {
    // Lire l'ID du commentaire à partir de l'URL
    const commentId = parseInt(req.params.id);
  
    // Lire le contenu du nouveau commentaire à partir du corps de la requête
    const newContent = req.body.content;
  
    // Lire les commentaires existants depuis le fichier JSON
    fs.readFile('comments.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Une erreur s'est produite lors de la lecture du fichier", err);
        return res.status(500).send('Erreur interne du serveur');
      }
  
      // Parse les données en JSON
      let comments = JSON.parse(data);
  
      // Trouver l'index du commentaire avec l'ID correspondant
      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      
      // Si le commentaire n'est pas trouvé, renvoyer une erreur
      if (commentIndex === -1) {
        return res.status(404).send('Commentaire non trouvé');
      }
  
      // Mettre à jour le contenu du commentaire
      comments[commentIndex].content = newContent;
  
      // Réécrire le fichier JSON avec le commentaire mis à jour
      fs.writeFile('comments.json', JSON.stringify(comments, null, 2), 'utf8', (err) => {
        if (err) {
          console.error("Une erreur s'est produite lors de l'écriture dans le fichier", err);
          return res.status(500).send('Erreur interne du serveur');
        }
  
        // Envoyer une réponse de succès
        res.send('Commentaire mis à jour');
      });
    });
  });
  

// Route Healthcheck
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

// Route par défaut pour "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
