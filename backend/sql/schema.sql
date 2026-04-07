CREATE DATABASE IF NOT EXISTS college_classroom_management;
USE college_classroom_management;

DROP TABLE IF EXISTS classroom_requests;
DROP TABLE IF EXISTS class_schedules;
DROP TABLE IF EXISTS allocations;
DROP TABLE IF EXISTS classrooms;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'faculty', 'student') NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    class_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    year_number TINYINT NOT NULL,
    division VARCHAR(10) NOT NULL,
    faculty_id INT,
    student_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classes_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_classes_faculty
        FOREIGN KEY (faculty_id) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_classes_year
        CHECK (year_number BETWEEN 1 AND 4)
);

ALTER TABLE users
ADD CONSTRAINT fk_users_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE SET NULL;

CREATE TABLE classrooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    seating_capacity INT NOT NULL,
    has_projector BOOLEAN NOT NULL DEFAULT FALSE,
    has_smart_board BOOLEAN NOT NULL DEFAULT FALSE,
    building_name VARCHAR(100),
    floor_number INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    classroom_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    semester_label VARCHAR(30) NOT NULL,
    status ENUM('scheduled', 'occupied', 'available') NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_allocations_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_allocations_classroom
        FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
        ON DELETE CASCADE
);

CREATE TABLE class_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    subject_name VARCHAR(120) NOT NULL,
    faculty_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    semester_label VARCHAR(30) NOT NULL,
    CONSTRAINT fk_schedule_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedule_faculty
        FOREIGN KEY (faculty_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE classroom_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    class_id INT NOT NULL,
    requested_classroom_id INT NOT NULL,
    request_reason VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    CONSTRAINT fk_request_faculty
        FOREIGN KEY (faculty_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_request_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_request_classroom
        FOREIGN KEY (requested_classroom_id) REFERENCES classrooms(id)
        ON DELETE CASCADE
);

INSERT INTO departments (name, code, description) VALUES
('Computer Engineering', 'COMP', 'Department for computer engineering studies'),
('Information Technology', 'IT', 'Department for information technology studies');

INSERT INTO users (name, role, email, password, class_id) VALUES
('System Admin', 'admin', 'admin@college.com', 'Password@123', NULL),
('Dr. Meera Kulkarni', 'faculty', 'faculty@college.com', 'Password@123', NULL);

INSERT INTO classes (department_id, name, year_number, division, faculty_id, student_count) VALUES
(1, 'SE-A', 2, 'A', 2, 60),
(1, 'TE-B', 3, 'B', 2, 55);

INSERT INTO users (name, role, email, password, class_id) VALUES
('Aarav Patil', 'student', 'student@college.com', 'Password@123', 1);

INSERT INTO classrooms (room_number, seating_capacity, has_projector, has_smart_board, building_name, floor_number) VALUES
('CR-101', 70, TRUE, TRUE, 'Main Block', 1),
('CR-202', 60, TRUE, FALSE, 'Main Block', 2),
('LAB-3', 40, TRUE, TRUE, 'Tech Wing', 3);

INSERT INTO allocations (class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status) VALUES
(1, 1, 'Monday', '09:00:00', '10:00:00', 'Semester 3', 'scheduled'),
(1, 2, 'Tuesday', '11:00:00', '12:00:00', 'Semester 3', 'scheduled'),
(2, 3, 'Wednesday', '10:00:00', '11:00:00', 'Semester 5', 'occupied');

INSERT INTO class_schedules (class_id, subject_name, faculty_id, day_of_week, start_time, end_time, semester_label) VALUES
(1, 'Data Structures', 2, 'Monday', '09:00:00', '10:00:00', 'Semester 3'),
(1, 'Database Management Systems', 2, 'Tuesday', '11:00:00', '12:00:00', 'Semester 3'),
(2, 'Web Technology', 2, 'Wednesday', '10:00:00', '11:00:00', 'Semester 5');

-- Demo login passwords for all seeded users: Password@123
