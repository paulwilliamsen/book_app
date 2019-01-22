'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', newSearch);
app.post('/searches', sendSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// HELPER FUNCTIONS

function newSearch (request, response) {
  response.render('./pages/index');
}

function sendSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  console.log(request.body.search);
  if (request.body.type === 'title') { url += `+intitle:${request.body.search}`; }
  if (request.body.type === 'author') { url += `+inauthor:${request.body.search}`; }

  return superagent.get(url)
    .then(apiResponse => {
      return apiResponse.body.items.map(bookResult => {
        new Book(bookResult);
      })
    })
    .then(mapResults => response.render('./pages/searches/show', {mapResults}))
    // .catch(error)

}

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  const book = info.volumeInfo;

  this.title = book.title ? book.title : 'No Title Found';
  this.author = book.authors ? book.authors : 'This Book Wrote Itself'
  this.img_url = book.imageLinks.thumbnail ? book.imageLinks.thumbnail : placeholderImage;
  this.description = info.description ? info.description : 'No Description Provided'
}
