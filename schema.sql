\c book_app;

DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS saved;

CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  img_url TEXT,
  authors VARCHAR(255),
  isbn NUMERIC (13,0),
  description TEXT,
  search_query VARCHAR(255),
);

CREATE TABLE saved (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  img_url TEXT,
  authors VARCHAR(255),
  isbn NUMERIC (13,0),
  description TEXT,
  search_query VARCHAR(255),
  bookshelf VARCHAR(255),
  FOREIGN KEY (results_id) REFERENCES results (id), 
);

