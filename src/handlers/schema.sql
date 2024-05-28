CREATE TABLE new_port0_prod (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    token TEXT,
    keyHash TEXT,
    aes256Bit TEXT,
    salt TEXT
);

INSERT INTO
    new_port0_prod (email, token, keyHash, aes256Bit, salt)
SELECT
    email,
    token,
    keyHash,
    aes256Bit,
    salt
FROM
    port0_prod;

DROP TABLE port0_prod;

ALTER TABLE
    new_port0_prod RENAME TO port0_prod;