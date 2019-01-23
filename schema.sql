\c book_app;

DROP TABLE IF EXISTS saved;

CREATE TABLE saved (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  img_url TEXT,
  authors VARCHAR(255),
  isbn NUMERIC (13,0),
  description TEXT,
  bookshelf VARCHAR(255),
);

