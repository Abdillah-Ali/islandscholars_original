-- Sample data for testing (optional)
-- This file will be executed automatically when the application starts

-- Insert sample universities
INSERT INTO universities (name, location, email, phone_number, description, website, established_year, student_count, faculty_count, created_at, updated_at) 
VALUES 
('State University of Zanzibar', 'Zanzibar', 'info@suza.ac.tz', '+255-24-2230750', 'Leading university in Zanzibar focusing on technology and innovation', 'https://suza.ac.tz', 1999, 8000, 400, NOW(), NOW()),
('University of Dar es Salaam', 'Dar es Salaam', 'info@udsm.ac.tz', '+255-22-2410500', 'Premier university in Tanzania', 'https://udsm.ac.tz', 1961, 40000, 1200, NOW(), NOW()),
('Sokoine University of Agriculture', 'Morogoro', 'info@sua.ac.tz', '+255-23-2640013', 'Leading agricultural university', 'https://sua.ac.tz', 1984, 15000, 800, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample organizations
INSERT INTO organizations (name, industry, location, email, description, website, company_size, founded_year, contact_person, contact_phone, created_at, updated_at)
VALUES 
('Vodacom Tanzania', 'telecommunications', 'Dar es Salaam', 'careers@vodacom.co.tz', 'Leading telecommunications company in Tanzania', 'https://vodacom.co.tz', '1000+ employees', 1999, 'HR Manager', '+255-75-5000000', NOW(), NOW()),
('CRDB Bank', 'banking & finance', 'Dar es Salaam', 'hr@crdbbank.com', 'Premier banking institution in Tanzania', 'https://crdbbank.co.tz', '501-1000 employees', 1996, 'Recruitment Team', '+255-22-2117442', NOW(), NOW()),
('Tanzania Ports Authority', 'logistics', 'Dar es Salaam', 'info@ports.go.tz', 'National ports authority managing maritime infrastructure', 'https://ports.go.tz', '1000+ employees', 1977, 'HR Department', '+255-22-2110959', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;