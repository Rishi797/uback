-- CREATE TABLES

CREATE TABLE Applicant (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(15),
    dob DATE
);

CREATE TABLE Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    position VARCHAR(100),
    branch VARCHAR(50),
    date_applied DATE,
    linkedin VARCHAR(200),
    relocation VARCHAR(10),
    FOREIGN KEY (applicant_id) REFERENCES Applicant(applicant_id)
);

CREATE TABLE Background (
    background_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    skills TEXT,
    experience INT,
    last_company VARCHAR(100),
    FOREIGN KEY (applicant_id) REFERENCES Applicant(applicant_id)
);

-- SAMPLE DATA

INSERT INTO Applicant (name, email, mobile, dob)
VALUES ('Alden', 'alden@gmail.com', '9876543210', '2004-05-10');

INSERT INTO Submissions (applicant_id, position, branch, date_applied, linkedin, relocation)
VALUES (1, 'Software Engineer', 'CSE', CURDATE(), 'linkedin.com/alden', 'Yes');

INSERT INTO Background (applicant_id, skills, experience, last_company)
VALUES (1, 'Java, SQL', 2, 'ABC Corp');

-- BASIC QUERY

SELECT * FROM Applicant;

-- JOIN QUERY

SELECT A.name, S.position
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id;

-- GROUP BY

SELECT position, COUNT(*) 
FROM Submissions 
GROUP BY position;

-- PROCEDURE

DELIMITER //
CREATE PROCEDURE total_applicants()
BEGIN
    SELECT COUNT(*) FROM Applicant;
END //
DELIMITER ;

-- TRIGGER

DELIMITER //
CREATE TRIGGER before_insert_applicant
BEFORE INSERT ON Applicant
FOR EACH ROW
BEGIN
    SET NEW.name = UPPER(NEW.name);
END //
DELIMITER ;