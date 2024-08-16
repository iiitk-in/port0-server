CREATE TABLE new_port0_prod (
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
    new_port0_prod (email, token, keyHash, aes256Bit, salt, verified)
SELECT
    email,
    token,
    keyHash,
    aes256Bit,
    salt
    verified
FROM
    port0_prod;

DROP TABLE port0_prod;

ALTER TABLE
    new_port0_prod RENAME TO port0_prod;
