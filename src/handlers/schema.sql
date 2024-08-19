DROP TABLE users;

CREATE TABLE new_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    otp TEXT,
    email TEXT,
    token TEXT,
    keyHash TEXT,
    aes256Bit TEXT,
    salt TEXT,
    verified INTEGER DEFAULT 0
);

INSERT INTO
    new_users (email, token, keyHash, aes256Bit, salt, verified)
 SELECT
     email,
     token,
     keyHash,
     aes256Bit,
     salt
     verified
 FROM
     port0_prod;

 DROP TABLE users; 

ALTER TABLE
    new_users RENAME TO users;
