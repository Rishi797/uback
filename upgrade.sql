USE jobapp;

ALTER TABLE Submissions ADD COLUMN status ENUM('New', 'Hold', 'Approved', 'Rejected') DEFAULT 'New';
ALTER TABLE Submissions ADD COLUMN decision_timestamp DATETIME NULL;

CREATE TABLE Files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    sender_type ENUM('Admin', 'Applicant'),
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
);
