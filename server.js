// requires express.js and path (a built in module to join paths)
const express = require('express');
const path = require('path');

// executes express
const app = express();
// port number that shouldn't change at all, all caps PORT will keep it this way
const PORT = process.env.PORT || 3001;

// *IMPORTANT!* middleware = what happens between request and response on server
// serves a static directory called public. will expose the public directory to the internet
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));

app.get('*', (req, res)=> {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(PORT, () =>
// console.log(DIR)
  console.log(`Example app listening at http://localhost:${PORT}`)
);

// npm start (looks for index.js, server.js, app.js)