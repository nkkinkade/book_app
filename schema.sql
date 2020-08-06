DROP TABLE IF EXISTS books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  authors VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR,
  isbn VARCHAR(255)
);

