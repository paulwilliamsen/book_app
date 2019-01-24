-- \c book_app;

DROP TABLE IF EXISTS saved;

CREATE TABLE saved (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  img_url TEXT,
  authors VARCHAR(255),
  isbn VARCHAR(50),
  description TEXT,
  bookshelf VARCHAR(255)
);
