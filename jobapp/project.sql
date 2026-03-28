-- ========================================
-- JOBAPP DATABASE SCHEMA
-- Complete with Tables, Views, Procedures, Triggers
-- ========================================

-- ========== 1. CREATE TABLES ==========

CREATE TABLE Applicant (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(15),
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    position VARCHAR(100),
    branch VARCHAR(50),
    date_applied DATE,
    linkedin VARCHAR(200),
    relocation VARCHAR(10),
    status ENUM('Pending', 'Reviewed', 'Selected', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (applicant_id) REFERENCES Applicant(applicant_id) ON DELETE CASCADE
);

CREATE TABLE Background (
    background_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    skills TEXT,
    experience INT,
    last_company VARCHAR(100),
    FOREIGN KEY (applicant_id) REFERENCES Applicant(applicant_id) ON DELETE CASCADE
);

CREATE TABLE Locate (
    locate_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    city VARCHAR(100),
    branch VARCHAR(50),
    mobile VARCHAR(15),
    position VARCHAR(100),
    FOREIGN KEY (applicant_id) REFERENCES Applicant(applicant_id) ON DELETE CASCADE
);

CREATE TABLE Visions (
    vision_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    vision_name VARCHAR(100),
    skills TEXT,
    description TEXT,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);

-- ========== 2. CREATE VIEWS ==========

-- VIEW 1: Applicant Details with all relationships
CREATE VIEW applicant_details_view AS
SELECT 
    A.applicant_id,
    A.name,
    A.email,
    A.mobile AS applicant_mobile,
    A.dob,
    S.submission_id,
    S.position,
    S.branch,
    S.date_applied,
    S.linkedin,
    S.relocation,
    S.status,
    B.skills,
    B.experience,
    B.last_company,
    L.city,
    L.branch AS location_branch,
    L.mobile AS location_mobile,
    V.vision_name,
    V.description AS vision_description
FROM Applicant A
LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
LEFT JOIN Background B ON A.applicant_id = B.applicant_id
LEFT JOIN Locate L ON A.applicant_id = L.applicant_id
LEFT JOIN Visions V ON S.submission_id = V.submission_id;

-- VIEW 2: Submission Summary by Position
CREATE VIEW submission_summary_view AS
SELECT 
    position,
    COUNT(submission_id) AS total_applications,
    COUNT(CASE WHEN status = 'Selected' THEN 1 END) AS selected_count,
    COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected_count,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN status = 'Reviewed' THEN 1 END) AS reviewed_count
FROM Submissions
GROUP BY position;

-- VIEW 3: Applicants by City
CREATE VIEW applicants_by_city_view AS
SELECT 
    L.city,
    COUNT(DISTINCT L.applicant_id) AS total_applicants,
    GROUP_CONCAT(DISTINCT A.name) AS applicant_names,
    GROUP_CONCAT(DISTINCT S.position) AS positions
FROM Locate L
JOIN Applicant A ON L.applicant_id = A.applicant_id
LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
GROUP BY L.city;

-- ========== 3. CREATE STORED PROCEDURES ==========

-- PROCEDURE 1: Get Total Applicants
DELIMITER //
CREATE PROCEDURE total_applicants()
BEGIN
    SELECT 
        COUNT(*) AS total_applicants,
        COUNT(DISTINCT email) AS unique_emails,
        COUNT(DISTINCT MONTH(dob)) AS birth_months
    FROM Applicant;
END //
DELIMITER ;

-- PROCEDURE 2: Get Applicants by Position
DELIMITER //
CREATE PROCEDURE get_applicants_by_position(IN position_name VARCHAR(100))
BEGIN
    SELECT 
        A.applicant_id,
        A.name,
        A.email,
        S.position,
        S.date_applied,
        B.experience,
        S.status
    FROM Applicant A
    JOIN Submissions S ON A.applicant_id = S.applicant_id
    LEFT JOIN Background B ON A.applicant_id = B.applicant_id
    WHERE S.position LIKE CONCAT('%', position_name, '%');
END //
DELIMITER ;

-- PROCEDURE 3: Get Applicants by City
DELIMITER //
CREATE PROCEDURE get_applicants_by_city(IN city_name VARCHAR(100))
BEGIN
    SELECT 
        A.applicant_id,
        A.name,
        A.email,
        L.city,
        S.position,
        B.experience
    FROM Applicant A
    JOIN Locate L ON A.applicant_id = L.applicant_id
    LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
    LEFT JOIN Background B ON A.applicant_id = B.applicant_id
    WHERE L.city = city_name;
END //
DELIMITER ;

-- PROCEDURE 4: Get Applicant Full Profile
DELIMITER //
CREATE PROCEDURE get_applicant_profile(IN app_id INT)
BEGIN
    SELECT * FROM applicant_details_view WHERE applicant_id = app_id LIMIT 1;
END //
DELIMITER ;

-- PROCEDURE 5: Update Submission Status
DELIMITER //
CREATE PROCEDURE update_submission_status(IN sub_id INT, IN new_status VARCHAR(20))
BEGIN
    UPDATE Submissions 
    SET status = new_status 
    WHERE submission_id = sub_id;
END //
DELIMITER ;

-- PROCEDURE 6: Get Statistics
DELIMITER //
CREATE PROCEDURE get_recruitment_statistics()
BEGIN
    SELECT 
        'Total Applicants' AS metric,
        COUNT(*) AS value
    FROM Applicant
    UNION ALL
    SELECT 'Total Submissions', COUNT(*) FROM Submissions
    UNION ALL
    SELECT 'Positions Open', COUNT(DISTINCT position) FROM Submissions
    UNION ALL
    SELECT 'Cities Covered', COUNT(DISTINCT city) FROM Locate
    UNION ALL
    SELECT 'Avg Experience (years)', ROUND(AVG(experience), 2) FROM Background;
END //
DELIMITER ;

-- ========== 4. CREATE TRIGGERS ==========

-- TRIGGER 1: Auto-Uppercase Applicant Name on Insert
DELIMITER //
CREATE TRIGGER before_insert_applicant
BEFORE INSERT ON Applicant
FOR EACH ROW
BEGIN
    SET NEW.name = UCASE(NEW.name);
    SET NEW.email = LOWER(NEW.email);
END //
DELIMITER ;

-- TRIGGER 2: Auto-Uppercase Applicant Name on Update
DELIMITER //
CREATE TRIGGER before_update_applicant
BEFORE UPDATE ON Applicant
FOR EACH ROW
BEGIN
    SET NEW.name = UCASE(NEW.name);
    SET NEW.email = LOWER(NEW.email);
END //
DELIMITER ;

-- TRIGGER 3: Log Submission Changes (optional audit trail)
DELIMITER //
CREATE TRIGGER after_insert_submission
AFTER INSERT ON Submissions
FOR EACH ROW
BEGIN
    UPDATE Applicant SET updated_at = CURRENT_TIMESTAMP WHERE applicant_id = NEW.applicant_id;
END //
DELIMITER ;

-- ========== 5. SAMPLE DATA ==========

INSERT INTO Applicant (name, email, mobile, dob)
VALUES 
('Alden', 'alden@gmail.com', '9876543210', '2004-05-10'),
('Priya Singh', 'priya.singh@gmail.com', '9123456789', '2003-08-15'),
('Raj Kumar', 'raj.kumar@gmail.com', '9234567890', '2002-12-20');

INSERT INTO Submissions (applicant_id, position, branch, date_applied, linkedin, relocation, status)
VALUES 
(1, 'Software Engineer', 'CSE', CURDATE(), 'linkedin.com/alden', 'Yes', 'Pending'),
(2, 'Data Analyst', 'IT', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'linkedin.com/priya', 'No', 'Reviewed'),
(3, 'Full Stack Developer', 'CSE', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'linkedin.com/raj', 'Yes', 'Selected');

INSERT INTO Background (applicant_id, skills, experience, last_company)
VALUES 
(1, 'Java, SQL, PHP', 2, 'ABC Corp'),
(2, 'Python, Excel, Tableau', 1, 'XYZ Analytics'),
(3, 'React, Node.js, MongoDB', 3, 'Tech Innovations');

INSERT INTO Locate (applicant_id, city, branch, mobile, position)
VALUES 
(1, 'Mumbai', 'CSE', '9876543210', 'Software Engineer'),
(2, 'Bangalore', 'IT', '9123456789', 'Data Analyst'),
(3, 'Delhi', 'CSE', '9234567890', 'Full Stack Developer');

INSERT INTO Visions (submission_id, vision_name, skills, description)
VALUES 
(1, 'Full-stack Goal', 'Java, PHP, MySQL, React', 'Build scalable hiring pipeline'),
(2, 'Data Scientist', 'Python, ML, Data Analysis', 'Create predictive models'),
(3, 'Tech Lead', 'System Design, Architecture', 'Lead development teams');

-- ========== 6. BASIC QUERIES FOR DEMONSTRATION ==========

-- SELECT all applicants
SELECT * FROM Applicant;

-- SELECT with WHERE clause
SELECT name, email FROM Applicant WHERE email LIKE '%@gmail.com';

-- SELECT with ORDER BY
SELECT name, experience FROM Applicant A JOIN Background B ON A.applicant_id = B.applicant_id ORDER BY experience DESC;

-- INSERT statement (example, data above inserted)
-- INSERT INTO Applicant (name, email, mobile, dob) VALUES ('Name', 'email@test.com', '1234567890', '2000-01-01');

-- UPDATE statement (example)
-- UPDATE Submissions SET status = 'Selected' WHERE submission_id = 1;

-- DELETE statement (example)
-- DELETE FROM Applicant WHERE applicant_id = 1;

-- ========== 7. COMPLEX QUERIES FOR DEMONSTRATION ==========

-- Query 1: INNER JOIN - Applicants with submissions
SELECT 
    A.name,
    A.email,
    S.position,
    S.date_applied,
    B.experience
FROM Applicant A
INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
INNER JOIN Background B ON A.applicant_id = B.applicant_id
ORDER BY B.experience DESC;

-- Query 2: LEFT JOIN - All applicants even without submissions
SELECT 
    A.name,
    COUNT(S.submission_id) AS submission_count,
    GROUP_CONCAT(S.position) AS positions
FROM Applicant A
LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
GROUP BY A.applicant_id, A.name;

-- Query 3: Subquery - Applicants with experience greater than average
SELECT 
    A.name,
    B.experience
FROM Applicant A
JOIN Background B ON A.applicant_id = B.applicant_id
WHERE B.experience > (SELECT AVG(experience) FROM Background);

-- Query 4: GROUP BY with HAVING - Positions with multiple applicants
SELECT 
    S.position,
    COUNT(*) AS applicant_count
FROM Submissions S
GROUP BY S.position
HAVING applicant_count > 1;

-- Query 5: UNION - Combine results from multiple queries
SELECT name AS person, email FROM Applicant
UNION
SELECT vision_name, '-' FROM Visions;

-- Query 6: Aggregation with multiple functions
SELECT 
    S.position,
    COUNT(*) AS total,
    AVG(B.experience) AS avg_experience,
    MIN(B.experience) AS min_experience,
    MAX(B.experience) AS max_experience
FROM Submissions S
LEFT JOIN Applicant A ON S.applicant_id = A.applicant_id
LEFT JOIN Background B ON A.applicant_id = B.applicant_id
GROUP BY S.position;

-- Query 7: Multiple JOINs with WHERE clause
SELECT 
    A.name,
    S.position,
    L.city,
    V.vision_name,
    B.experience
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id
JOIN Locate L ON A.applicant_id = L.applicant_id
JOIN Background B ON A.applicant_id = B.applicant_id
LEFT JOIN Visions V ON S.submission_id = V.submission_id
WHERE L.city = 'Mumbai' AND B.experience > 1;

-- Query 8: CASE statement - Status categorization
SELECT 
    A.name,
    S.status,
    CASE 
        WHEN S.status = 'Selected' THEN 'Ready for onboarding'
        WHEN S.status = 'Reviewed' THEN 'Under consideration'
        WHEN S.status = 'Rejected' THEN 'Not selected'
        ELSE 'Pending review'
    END AS action_required
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id;

-- ========== 8. STORED PROCEDURES CALLS (For Testing) ==========

-- CALL total_applicants();
-- CALL get_applicants_by_position('Software Engineer');
-- CALL get_applicants_by_city('Mumbai');
-- CALL get_applicant_profile(1);
-- CALL get_recruitment_statistics();

-- ========== 9. VIEWS QUERIES (For Testing) ==========

-- SELECT * FROM applicant_details_view;
-- SELECT * FROM submission_summary_view;
-- SELECT * FROM applicants_by_city_view;