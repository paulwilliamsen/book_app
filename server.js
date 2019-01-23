'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.set('view engine', 'ejs');

// app.get('/', homeBooks);

app.get('/searches/new', newSearch);
app.post('/searches', sendSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// HELPER FUNCTIONS

function newSearch (request, response) {
  response.render('./pages/index');
}

// function sendSearch(request, response) {
//   let url = 'https://www.googleapis.com/books/v1/volumes?q=';
//   if (request.body.type === 'title') { url += `+intitle:${request.body.search}`; }
//   if (request.body.type === 'author') { url += `+inauthor:${request.body.search}`; }



//   return superagent.get(url)
//     .then(apiResponse => {
//       return apiResponse.body.items.map(bookResult => {
//         return new Book(bookResult);
//       })
//     })
//     .then(mapResults => {
//       response.render('./pages/searches/show', {mapResults})
//     })
//     .catch(error => handleError(error, response));
// }

function sendSearch(request) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (request.body.type === 'title') { url += `+intitle:${request.body.search}`; }
  if (request.body.type === 'author') { url += `+inauthor:${request.body.search}`; }

  return superagent.get(url)
    .then(apiResponse => {
      if (!apiResponse.body.items.length) {
        throw 'No Book Results';
      } else {
        let newBook = new Book(apiResponse);
        return newBook.save()
          .then(result => {
            newBook.id = result.rows[0].id;
            return newBook;
          })
      }
    });
}

function getSearch(request, response) {
  const searchHandler = {
    query: request.body.data,
    
    cacheHit: results => {
      console.log('Recieved search data from SQL');
      response.send(results.rows[0]);
    },

    cacheMiss: () => {
      sendSearch(request.body.data)
        .then(data => response.send(data));
    },

  };
  searchLookup(searchHandler);
}

searchLookup = (handler, table) => {
  const sql = `SELECT * FROM ${table} WHERE query=$1;`;
  const values = []
}

function handleError(error, response) {
  console.error(error);
  if (response) response.status(500).send('Sorry, something went wrong! - Error written by PW & CB');
}

function Book(query, apiResult) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  const book = apiResult.volumeInfo;

  this.title = book.title ? book.title : 'No Title Found';
  this.img_url = book.imageLinks.thumbnail ? book.imageLinks.thumbnail : placeholderImage;
  this.authors = book.authors ? book.authors[0] : 'This Book Wrote Itself';
  this.isbn = book.industryIdentifiers[0].identifier ? `ISBN 13: ${book.industryIdentifiers[0].identifier}` : 'No ISBN Provided';
  this.description = book.description ? book.description : 'No Description Provided';
  this.search_query = query.search.toLowerCase();
}
