// let Notes = {};
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helper/uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// get the notes from db.json
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    res.status(200).json(JSON.parse(data))
  console.info(`${req.method} request recieved to GET notes!`)
  }
  );
})

// delete a note from db.json
app.delete('/api/notes/:id', (req, res) => { 
  const filteredNotes = [];
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    console.info(`delete request called`)
    console.log(req.params.id);
    let noteNote = JSON.parse(data);
    for (let i = 0; i < noteNote.length; i++) {
     if (noteNote[i].id !== req.params.id) {
     filteredNotes.push(noteNote[i]);
    }}
    console.log(filteredNotes);
    
    fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Sucessfully deleted a note!')
        );
    
        res.send('body');
  })
  
})

// post new note to db.json
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.err(err);
      } else {
        console.log(data);
        const parsedNotes = JSON.parse(data);
       parsedNotes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 2),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Sucessfully wrote a new note!')
        );
      }
    })

    const response = {
      status: 'Success!',
      body: newNote
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in creating note');
  }
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () =>
  console.log(`listening at http://localhost:${PORT}`)
);
