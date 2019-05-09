INSERT INTO 
  server_state (id, refresh_tokens) 
VALUES
  (
    1, '{}'
  )
;

INSERT INTO
    users ( id, first_name, last_name, username, email_address, date_of_birth, settings, hashed_password, scope ) 
VALUES
    (
        '32e5a8a8-fb65-11e8-9c53-0242ac110002', 'Some', 'User', 'admin', 'email@domain.com', '2019-01-01', '{ "darkMode": false, "colors": { "lightPrimary": "#000000", "lightAccent": "#000000", "darkPrimary": "#000000", "darkAccent": "#000000" } }', '$2a$10$yTVUkddFs4sT2CBAiWkbGOp3Y5R4MMUrQ/IQo0nSbDHQfJuYNwMJu', 0
    )
;

INSERT INTO
    todos ( user_id, title, description, completed ) 
VALUES
    (
        '32e5a8a8-fb65-11e8-9c53-0242ac110002', 'Red Todo', 'This is a Red Todo!', FALSE 
    )
;

INSERT INTO
    todos ( user_id, title, description, completed ) 
VALUES
    (
        '32e5a8a8-fb65-11e8-9c53-0242ac110002', 'Blue Todo', 'This is a Blue Todo!', FALSE 
    )
;

INSERT INTO
    todos ( user_id, title, description, completed ) 
VALUES
    (
        '32e5a8a8-fb65-11e8-9c53-0242ac110002', 'Green Todo', 'This is a Green Todo!', FALSE 
    )
;
