-- ========================================
-- ADDITIONAL QUERIES FOR EVALUATION
-- Demonstrating: Basic, Complex, Aggregation, Subquery
-- ========================================

-- ========== BASIC QUERIES ==========

-- Query 1: Simple SELECT
SELECT * FROM Applicant;

-- Query 2: SELECT with specific columns
SELECT applicant_id, name, email FROM Applicant;

-- Query 3: WHERE clause
SELECT * FROM Applicant WHERE email LIKE '%@gmail.com';

-- Query 4: ORDER BY
SELECT * FROM Applicant ORDER BY name ASC;

-- Query 5: LIMIT
SELECT * FROM Applicant LIMIT 5;

-- Query 6: COUNT aggregation
SELECT COUNT(*) AS total_applicants FROM Applicant;

-- ========== COMPLEX QUERIES ==========

-- Query 7: INNER JOIN - 2 tables
SELECT A.name, A.email, S.position 
FROM Applicant A
INNER JOIN Submissions S ON A.applicant_id = S.applicant_id;

-- Query 8: INNER JOIN - 3 tables
SELECT 
    A.name, 
    A.email, 
    S.position, 
    B.experience
FROM Applicant A
INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
INNER JOIN Background B ON A.applicant_id = B.applicant_id;

-- Query 9: INNER JOIN - 4 tables
SELECT 
    A.name, 
    A.email, 
    S.position, 
    B.experience,
    L.city
FROM Applicant A
INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
INNER JOIN Background B ON A.applicant_id = B.applicant_id
INNER JOIN Locate L ON A.applicant_id = L.applicant_id;

-- Query 10: INNER JOIN - 5 tables
SELECT 
    A.name, 
    A.email, 
    S.position, 
    B.experience,
    L.city,
    V.vision_name
FROM Applicant A
INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
INNER JOIN Background B ON A.applicant_id = B.applicant_id
INNER JOIN Locate L ON A.applicant_id = L.applicant_id
INNER JOIN Visions V ON S.submission_id = V.submission_id;

-- Query 11: LEFT JOIN
SELECT 
    A.name,
    COUNT(S.submission_id) AS submission_count
FROM Applicant A
LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
GROUP BY A.applicant_id, A.name;

-- Query 12: WHERE with JOIN
SELECT 
    A.name, 
    S.position, 
    L.city,
    B.experience
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id
JOIN Locate L ON A.applicant_id = L.applicant_id
JOIN Background B ON A.applicant_id = B.applicant_id
WHERE L.city = 'Mumbai' AND B.experience > 1;

-- ========== AGGREGATION QUERIES ==========

-- Query 13: GROUP BY with COUNT
SELECT 
    S.position,
    COUNT(*) AS applicant_count
FROM Submissions S
GROUP BY S.position;

-- Query 14: GROUP BY with AVG
SELECT 
    S.position,
    AVG(B.experience) AS avg_experience
FROM Submissions S
LEFT JOIN Applicant A ON S.applicant_id = A.applicant_id
LEFT JOIN Background B ON A.applicant_id = B.applicant_id
GROUP BY S.position;

-- Query 15: GROUP BY with multiple aggregates
SELECT 
    S.position,
    COUNT(*) AS total_applicants,
    AVG(B.experience) AS avg_experience,
    MIN(B.experience) AS min_experience,
    MAX(B.experience) AS max_experience,
    COUNT(DISTINCT L.city) AS cities_count
FROM Submissions S
LEFT JOIN Applicant A ON S.applicant_id = A.applicant_id
LEFT JOIN Background B ON A.applicant_id = B.applicant_id
LEFT JOIN Locate L ON A.applicant_id = L.applicant_id
GROUP BY S.position;

-- Query 16: GROUP BY with HAVING
SELECT 
    S.position,
    COUNT(*) AS applicant_count
FROM Submissions S
GROUP BY S.position
HAVING applicant_count > 1;

-- Query 17: GROUP_CONCAT with GROUP BY
SELECT 
    L.city,
    COUNT(*) AS total_applicants,
    GROUP_CONCAT(DISTINCT A.name) AS applicant_names
FROM Locate L
JOIN Applicant A ON L.applicant_id = A.applicant_id
GROUP BY L.city;

-- ========== SUBQUERY QUERIES ==========

-- Query 18: Subquery in WHERE clause
SELECT 
    A.name,
    B.experience
FROM Applicant A
JOIN Background B ON A.applicant_id = B.applicant_id
WHERE B.experience > (SELECT AVG(experience) FROM Background);

-- Query 19: Subquery with IN
SELECT * FROM Applicant 
WHERE applicant_id IN (
    SELECT DISTINCT applicant_id FROM Submissions 
    WHERE position = 'Software Engineer'
);

-- Query 20: Subquery with NOT IN
SELECT * FROM Applicant 
WHERE applicant_id NOT IN (
    SELECT applicant_id FROM Submissions 
    WHERE status = 'Rejected'
);

-- Query 21: Correlated subquery
SELECT A.name, 
       (SELECT COUNT(*) FROM Submissions WHERE applicant_id = A.applicant_id) AS submission_count
FROM Applicant A;

-- ========== ADVANCED QUERIES ==========

-- Query 22: CASE statement
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

-- Query 23: UNION
SELECT name FROM Applicant
UNION
SELECT vision_name FROM Visions;

-- Query 24: ORDER BY multiple columns
SELECT 
    A.name,
    B.experience,
    S.position
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id
JOIN Background B ON A.applicant_id = B.applicant_id
ORDER BY B.experience DESC, A.name ASC;

-- Query 25: Date functions
SELECT 
    A.name,
    A.dob,
    YEAR(CURDATE()) - YEAR(A.dob) AS age,
    DATEDIFF(CURDATE(), S.date_applied) AS days_since_application
FROM Applicant A
JOIN Submissions S ON A.applicant_id = S.applicant_id;

-- ========== ANALYTICS QUERIES ==========

-- Query 26: Applicants without experience
SELECT A.name, A.email 
FROM Applicant A
LEFT JOIN Background B ON A.applicant_id = B.applicant_id
WHERE B.experience IS NULL OR B.experience = 0;

-- Query 27: Most experienced applicants
SELECT A.name, B.experience, S.position
FROM Applicant A
JOIN Background B ON A.applicant_id = B.applicant_id
JOIN Submissions S ON A.applicant_id = S.applicant_id
ORDER BY B.experience DESC
LIMIT 5;

-- Query 28: Position distribution
SELECT S.position, COUNT(*) AS count
FROM Submissions S
GROUP BY S.position
ORDER BY count DESC;

-- Query 29: Geographic distribution
SELECT L.city, COUNT(DISTINCT L.applicant_id) AS applicant_count
FROM Locate L
GROUP BY L.city
ORDER BY applicant_count DESC;

-- Query 30: Skills analysis
SELECT A.name, B.skills, B.experience
FROM Applicant A
JOIN Background B ON A.applicant_id = B.applicant_id
WHERE B.skills LIKE '%Java%' OR B.skills LIKE '%Python%'
ORDER BY B.experience DESC;

-- ========== UPDATE AND DELETE PATTERNS ==========

-- Example: Update submission status (be careful with this)
-- UPDATE Submissions SET status = 'Reviewed' WHERE submission_id = 1;

-- Example: Delete an applicant and cascade to all related records
-- DELETE FROM Applicant WHERE applicant_id = 1;

-- Example: Delete all rejected applications
-- DELETE FROM Submissions WHERE status = 'Rejected';

-- ========== TRANSACTION PATTERN ==========
/*
START TRANSACTION;
INSERT INTO Applicant (name, email, mobile, dob) VALUES ('John', 'john@test.com', '1234567890', '2000-01-01');
SET @app_id = LAST_INSERT_ID();
INSERT INTO Submissions (applicant_id, position, branch, date_applied, linkedin, relocation)
VALUES (@app_id, 'Engineer', 'CSE', CURDATE(), 'linkedin.com/john', 'Yes');
COMMIT;
*/
