-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
-- IMPORTANT: Change this password after first login!
INSERT INTO admin_users (email, password_hash)
VALUES (
  'admin@anaylaris.com',
  '$2a$10$rB5YLLXf4I/NYYvK3.z9cOxJ9YvGsJ0K2qYVhWk5qZGJ8NQMG5WFO'
)
ON CONFLICT (email) DO NOTHING;
