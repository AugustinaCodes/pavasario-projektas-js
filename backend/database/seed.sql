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
INSERT INTO sessions (
  title,
  description,
  duration_minutes,
  price,
  session_type,
  capacity
)
VALUES
  (
    'Personal Training',
    'One-on-one training session with a personal coach focused on individual goals, technique and progress.',
    60,
    40.00,
    'individual',
    1
  ),
  (
    'Strength Training',
    'Structured strength workout focused on building muscle, improving form and increasing overall power.',
    60,
    35.00,
    'group',
    12
  ),
  (
    'Weight Loss Consultation',
    'Consultation session focused on weight loss goals, training direction and basic nutrition guidance.',
    45,
    30.00,
    'individual',
    1
  ),
  (
    'Beginner Gym Introduction',
    'Introductory gym session for beginners covering basic exercises, equipment use and safe training habits.',
    45,
    25.00,
    'individual',
    1
  ),
  (
    'Mobility and Stretching',
    'Low-intensity session focused on mobility, flexibility, posture and recovery.',
    30,
    20.00,
    'group',
    16
  ),
  (
    'HIIT Circuit',
    'High-intensity interval training combining cardio and full-body strength exercises.',
    45,
    28.00,
    'group',
    14
  ),
  (
    'Yoga Flow',
    'Guided yoga session focused on mobility, balance, breathing and controlled movement.',
    60,
    22.00,
    'group',
    16
  ),
  (
    'Boxing Fundamentals',
    'Beginner-friendly boxing session covering stance, footwork, combinations and conditioning.',
    60,
    32.00,
    'group',
    10
  ),
  (
    'Posture Assessment',
    'Individual posture and movement assessment with personalised exercise recommendations.',
    45,
    30.00,
    'individual',
    1
  ),
  (
    'Core and Stability',
    'Group workout focused on core strength, balance and movement control.',
    45,
    24.00,
    'group',
    12
  );

-- Scheduled group session times
INSERT INTO session_slots (session_id, session_date, start_time)
VALUES
  (2, '2026-06-08', '18:00'),
  (2, '2026-06-10', '18:00'),
  (5, '2026-06-09', '17:30'),
  (5, '2026-06-11', '17:30'),
  (6, '2026-06-08', '19:00'),
  (6, '2026-06-12', '18:00'),
  (7, '2026-06-09', '18:30'),
  (7, '2026-06-13', '10:00'),
  (8, '2026-06-10', '19:00'),
  (8, '2026-06-13', '12:00'),
  (10, '2026-06-11', '18:30'),
  (10, '2026-06-14', '11:00');

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
