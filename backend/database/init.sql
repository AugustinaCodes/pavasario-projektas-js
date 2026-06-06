-- FitBook initial database schema

-- Drop tables in correct order because bookings depends on users and sessions
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS session_slots;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training sessions / services table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  session_type VARCHAR(20) NOT NULL
    CHECK (session_type IN ('individual', 'group')),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  CONSTRAINT individual_session_capacity
    CHECK (session_type <> 'individual' OR capacity = 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled times for group sessions
CREATE TABLE session_slots (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_session_slots_session
    FOREIGN KEY (session_id)
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_session_slot
    UNIQUE (session_id, session_date, start_time)
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  session_slot_id INTEGER,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bookings_session
    FOREIGN KEY (session_id)
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bookings_session_slot
    FOREIGN KEY (session_slot_id)
    REFERENCES session_slots(id)
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX unique_active_user_booking_time
  ON bookings (user_id, session_id, booking_date, booking_time)
  WHERE status <> 'cancelled';
