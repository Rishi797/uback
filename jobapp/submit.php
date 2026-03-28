<?php
/**
 * APPLICATION FORM SUBMISSION HANDLER
 * Validates and inserts data into 5 tables
 * Demonstrates: CRUD, Data Integrity, Error Handling
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

// Get form data and sanitize
$name = htmlspecialchars(trim($_POST['name'] ?? ''));
$email = htmlspecialchars(trim($_POST['email'] ?? ''));
$mobile = htmlspecialchars(trim($_POST['mobile'] ?? ''));
$dob = htmlspecialchars(trim($_POST['dob'] ?? ''));

$position = htmlspecialchars(trim($_POST['position'] ?? ''));
$branch = htmlspecialchars(trim($_POST['branch'] ?? ''));
$linkedin = htmlspecialchars(trim($_POST['linkedin'] ?? ''));
$relocation = htmlspecialchars(trim($_POST['relocation'] ?? ''));

$skills = htmlspecialchars(trim($_POST['skills'] ?? ''));
$experience = intval($_POST['experience'] ?? 0);
$company = htmlspecialchars(trim($_POST['company'] ?? ''));

$loc_city = htmlspecialchars(trim($_POST['loc_city'] ?? ''));
$loc_branch = htmlspecialchars(trim($_POST['loc_branch'] ?? ''));
$loc_mobile = htmlspecialchars(trim($_POST['loc_mobile'] ?? ''));
$loc_position = htmlspecialchars(trim($_POST['loc_position'] ?? ''));

$vision_name = htmlspecialchars(trim($_POST['vision_name'] ?? ''));
$vision_skills = htmlspecialchars(trim($_POST['vision_skills'] ?? ''));
$vision_description = htmlspecialchars(trim($_POST['vision_description'] ?? ''));

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Valid email is required";
}

if (empty($position)) {
    $errors[] = "Position applied is required";
}

if (empty($skills)) {
    $errors[] = "Skills are required";
}

if (!empty($mobile) && !preg_match("/^[0-9]{10}$/", $mobile)) {
    $errors[] = "Mobile number must be 10 digits";
}

// Check if email already exists
$email_check = $conn->query("SELECT applicant_id FROM applicant WHERE email = '$email'");
if ($email_check->num_rows > 0) {
    $errors[] = "This email is already registered";
}

if (!empty($errors)) {
    // Show errors
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Error</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Poppins', sans-serif;
                min-height: 100vh;
                padding: 30px 20px;
            }
            .error-container {
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                padding: 40px;
                max-width: 600px;
                margin: 0 auto;
            }
            .error-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .error-icon {
                font-size: 60px;
                color: #e74c3c;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-header">
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2 style="color: #e74c3c;">Submission Failed!</h2>
            </div>
            <div class="alert alert-danger">
                <h5>Please fix the following errors:</h5>
                <ul style="margin-bottom: 0;">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo $error; ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="text-center">
                <a href="apply.php" class="btn btn-primary">← Go Back to Form</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit();
}

// Begin transaction for data integrity
$conn->begin_transaction();

try {
    // Insert Applicant
    $sql1 = "INSERT INTO applicant (name, email, mobile, dob)
            VALUES ('$name', '$email', '$mobile', '$dob')";

    if (!$conn->query($sql1)) {
        throw new Exception("Error inserting applicant: " . $conn->error);
    }

    $applicant_id = $conn->insert_id;

    // Insert Submissions
    $sql2 = "INSERT INTO submissions (applicant_id, position, branch, date_applied, linkedin, relocation, status)
            VALUES ('$applicant_id', '$position', '$branch', CURDATE(), '$linkedin', '$relocation', 'Pending')";

    if (!$conn->query($sql2)) {
        throw new Exception("Error inserting submission: " . $conn->error);
    }

    $submission_id = $conn->insert_id;

    // Insert Background
    $sql3 = "INSERT INTO background (applicant_id, skills, experience, last_company)
            VALUES ('$applicant_id', '$skills', '$experience', '$company')";

    if (!$conn->query($sql3)) {
        throw new Exception("Error inserting background: " . $conn->error);
    }

    // Insert Locate
    $sql4 = "INSERT INTO locate (applicant_id, city, branch, mobile, position)
            VALUES ('$applicant_id', '$loc_city', '$loc_branch', '$loc_mobile', '$loc_position')";

    if (!$conn->query($sql4)) {
        throw new Exception("Error inserting locate: " . $conn->error);
    }

    // Insert Visions
    $sql5 = "INSERT INTO visions (submission_id, vision_name, skills, description)
            VALUES ('$submission_id', '$vision_name', '$vision_skills', '$vision_description')";

    if (!$conn->query($sql5)) {
        throw new Exception("Error inserting vision: " . $conn->error);
    }

    // Commit transaction
    $conn->commit();

    // Success page
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application Submitted - HireConnect</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Poppins', sans-serif;
                min-height: 100vh;
                padding: 30px 20px;
            }
            .success-container {
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                padding: 50px;
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
                animation: slideInUp 0.5s ease;
            }
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .success-icon {
                font-size: 80px;
                color: #27ae60;
                margin-bottom: 20px;
                animation: scaleIn 0.5s ease;
            }
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                }
                to {
                    transform: scale(1);
                }
            }
            .success-title {
                color: #27ae60;
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 15px;
            }
            .success-message {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .applicant-id {
                background: #d4edda;
                border-left: 4px solid #27ae60;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 30px;
                font-size: 16px;
                color: #155724;
                font-weight: 600;
            }
            .next-steps {
                background: #e7f3ff;
                border-left: 4px solid #667eea;
                padding: 20px;
                border-radius: 8px;
                text-align: left;
                margin-bottom: 30px;
            }
            .next-steps h4 {
                color: #0066cc;
                margin-bottom: 15px;
            }
            .next-steps ol {
                margin-bottom: 0;
                color: #333;
            }
            .next-steps li {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1 class="success-title">Application Submitted! ✅</h1>
            <p class="success-message">
                Thank you for your interest! Your job application has been successfully submitted.
            </p>

            <div class="applicant-id">
                <i class="fas fa-id-badge"></i> Your Application ID: <strong><?php echo $applicant_id; ?></strong>
            </div>

            <div class="next-steps">
                <h4><i class="fas fa-list-check"></i> What Happens Next?</h4>
                <ol>
                    <li>Your application will be reviewed by our team within 2-3 business days</li>
                    <li>You'll receive an email confirmation at: <strong><?php echo $email; ?></strong></li>
                    <li>Keep an eye on your inbox for interview schedules and updates</li>
                    <li>Make sure all your contact information is up-to-date</li>
                </ol>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="apply.php" class="btn btn-outline-primary">
                    <i class="fas fa-plus-circle"></i> Submit Another Application
                </a>
                <a href="index.php" class="btn btn-primary">
                    <i class="fas fa-home"></i> Back to Home
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php

} catch (Exception $e) {
    $conn->rollback();
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Error</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 30px 20px;
            }
        </style>
    </head>
    <body>
        <div class="alert alert-danger" role="alert" style="max-width: 600px; margin: 50px auto;">
            <h4 class="alert-heading">Error!</h4>
            <p><?php echo htmlspecialchars($e->getMessage()); ?></p>
            <a href="apply.php" class="btn btn-primary">Go Back</a>
        </div>
    </body>
    </html>
    <?php
}
?>