'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));


app.use(express.static('public'));


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');

app.get('/', getSavedBooks);

app.get('/searches/new', newSearch);
app.post('/searches', sendSearch);

app.post('/', saveBook);

app.get('/books/:book_id', getOneBookDetail);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// HELPER FUNCTIONS

function getSavedBooks (request, response) {
  const SQL = 'SELECT * FROM saved;';

  return client.query(SQL)
    .then(results => {
      response.render('./pages/index', {results: results.rows});
    })
    .catch(handleError);
}

function getOneBookDetail(request, response) {
  const SQL = 'SELECT * FROM saved WHERE id=$1;';
  const values = [request.params.book_id];

  return client.query(SQL, values)
    .then(result => response.render('./pages/books/show', {book: result.rows[0]}))
    .catch(err => handleError(err, response));
}


function saveBook (request, response) {
  const {title, img_url, authors, isbn, description, bookshelf} = request.body;
  const SQL = 'INSERT INTO saved (title, img_url, authors, isbn, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  const values = [title, img_url, authors, isbn, description, bookshelf];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

function newSearch (request, response) {
  response.render('./pages/searches/new');
}

function sendSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (request.body.type === 'title') { url += `+intitle:${request.body.search}`; }
  if (request.body.type === 'author') { url += `+inauthor:${request.body.search}`; }

  return superagent.get(url)
    .then(apiResponse => {
      return apiResponse.body.items.map(bookResult => {
        return new Book(bookResult);
      })
    })
    .then(mapResults => {
      response.render('./pages/searches/show', {mapResults})
    })
    .catch(error => handleError(error, response));
}

function handleError(error, response) {
  console.error(error);
  if (response) response.status(500).send('Sorry, something went wrong! - Error written by PW & CB');
}

function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  const book = info.volumeInfo;

  this.title = book.title ? book.title : 'No Title Found';
  this.img_url = book.imageLinks ? book.imageLinks.thumbnail : placeholderImage;
  this.authors = book.authors ? book.authors[0] : 'This Book Wrote Itself';
  this.isbn = book.industryIdentifiers[0].identifier ? `ISBN 13: ${book.industryIdentifiers[0].identifier}` : 'No ISBN Provided';
  this.description = book.description ? book.description : 'No Description Provided';
}
