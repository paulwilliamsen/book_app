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

INSERT INTO saved (title, img_url, authors, isbn, description, bookshelf) 
VALUES('turtle','www.google.com','Paul Williamsen','ISBN: 1728374526371','This book is amazing.','Rusty'),
('potato','www.google.com','Chris Ball','ISBN: 1728378726371','This book is terrible.','Short'),
('The Best On The Market','www.google.com','Paul','ISBN: 8888874526371','Such good.','Rusty');