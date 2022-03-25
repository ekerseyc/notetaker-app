const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('express/lib/response');
const uuid = require('./helper/uuid');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', function (err, data) {
    console.log('data loaded', JSON.parse(data))
    res.json(JSON.parse(data))
  })
})

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;

  if (title && text) {
    const note = {
      title,
      text,
      review_id: uuid()
    };

    const noteString = JSON.stringify(note);

    fs.writeFile(`./db/db${ note.title }.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(`New note ${note.text} has been written to JSON file`
        )
    );

    const response = {
      status: 'success',
      body: note,
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
