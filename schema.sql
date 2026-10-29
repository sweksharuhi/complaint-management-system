CREATE DATABASE IF NOT EXISTS ocms;
USE ocms;

CREATE TABLE departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','staff','admin') NOT NULL DEFAULT 'student',
  department_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE complaints (
  complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  department_id INT NOT NULL,
  assigned_to INT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority ENUM('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending','Assigned','In Progress','Resolved','Closed') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

CREATE TABLE complaint_updates (
  update_id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  updated_by INT NOT NULL,
  status ENUM('Pending','Assigned','In Progress','Resolved','Closed') NOT NULL,
  remarks TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

INSERT INTO departments (department_name) VALUES
('Academic Department'),('IT Department'),('Hostel Department'),('Library'),('Maintenance');

INSERT INTO users (name,email,password,role,department_id) VALUES
('Admin','admin@college.edu','admin123','admin',NULL),
('Demo Student','student@college.edu','student123','student',NULL),
('IT Staff','itstaff@college.edu','staff123','staff',2);

-- Sample complaint
INSERT INTO complaints
(student_id,department_id,subject,description,category,priority,status)
VALUES
(2,2,'Classroom projector not working','Projector in Room 204 is not displaying anything.','IT','High','In Progress');
