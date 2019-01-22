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
app.get('/hello', newSearch );

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function newSearch (request, response) {
  response.render('pages/index');
}

