CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    location VARCHAR(100) NOT NULL,
    capacity INT CHECK (capacity > 0 AND capacity <= 1000) NOT NULL
);

CREATE TABLE registrations (
    user_id INT REFERENCES users(id),
    event_id INT REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);
