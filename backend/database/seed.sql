-- FitBook seed data

-- Demo users
-- Password for all demo users: Password123!
-- Hash generated with bcrypt.
INSERT INTO users (name, email, password, role)
VALUES
  (
    'Admin User',
    'admin@fitbook.com',
    '$2b$10$SNJDJbICEFbzZiYWPOv8muB7Q5iHw4XP0muva/xjnWQE5OaJJsxlu',
    'admin'
  ),
  (
    'John Smith',
    'john.smith@example.com',
    '$2b$10$SNJDJbICEFbzZiYWPOv8muB7Q5iHw4XP0muva/xjnWQE5OaJJsxlu',
    'user'
  ),
  (
    'Emily Johnson',
    'emily.johnson@example.com',
    '$2b$10$SNJDJbICEFbzZiYWPOv8muB7Q5iHw4XP0muva/xjnWQE5OaJJsxlu',
    'user'
  ),
  (
    'Michael Brown',
    'michael.brown@example.com',
    '$2b$10$SNJDJbICEFbzZiYWPOv8muB7Q5iHw4XP0muva/xjnWQE5OaJJsxlu',
    'user'
  ),
  (
    'Sarah Davis',
    'sarah.davis@example.com',
    '$2b$10$SNJDJbICEFbzZiYWPOv8muB7Q5iHw4XP0muva/xjnWQE5OaJJsxlu',
    'user'
  );

-- Demo training sessions
INSERT INTO sessions (title, description, duration_minutes, price)
VALUES
  (
    'Personal Training',
    'One-on-one training session with a personal coach focused on individual goals, technique and progress.',
    60,
    40.00
  ),
  (
    'Strength Training',
    'Structured strength workout focused on building muscle, improving form and increasing overall power.',
    60,
    35.00
  ),
  (
    'Weight Loss Consultation',
    'Consultation session focused on weight loss goals, training direction and basic nutrition guidance.',
    45,
    30.00
  ),
  (
    'Beginner Gym Introduction',
    'Introductory gym session for beginners covering basic exercises, equipment use and safe training habits.',
    45,
    25.00
  ),
  (
    'Mobility and Stretching',
    'Low-intensity session focused on mobility, flexibility, posture and recovery.',
    30,
    20.00
  );

-- Demo bookings
INSERT INTO bookings (user_id, session_id, booking_date, booking_time, status, notes)
VALUES
  (
    2,
    1,
    '2026-06-01',
    '10:00',
    'pending',
    'First personal training session.'
  ),
  (
    3,
    2,
    '2026-06-01',
    '12:00',
    'confirmed',
    'Focus on strength basics.'
  ),
  (
    4,
    3,
    '2026-06-02',
    '09:30',
    'completed',
    'Weight loss consultation completed.'
  ),
  (
    5,
    4,
    '2026-06-03',
    '14:00',
    'cancelled',
    'User cancelled beginner introduction session.'
  ),
  (
    2,
    5,
    '2026-06-04',
    '16:00',
    'confirmed',
    'Mobility and recovery session.'
  );