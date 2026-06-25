CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) 
VALUES ('Joku Nimi', 'www.osote.fi', 'Titteli', 11);
                
INSERT INTO blogs (author, url, title, likes) 
VALUES ('Eri Kutsuma', 'www.eriosote.fi', 'Tuura', 22);