<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

// Get form data safely
$name = $conn->real_escape_string($_POST['name']);
$email = $conn->real_escape_string($_POST['email']);
$mobile = $conn->real_escape_string($_POST['mobile']);
$dob = $conn->real_escape_string($_POST['dob']);

$position = $conn->real_escape_string($_POST['position']);
$branch = $conn->real_escape_string($_POST['branch']);
$linkedin = $conn->real_escape_string($_POST['linkedin']);
$relocation = $conn->real_escape_string($_POST['relocation']);

$skills = $conn->real_escape_string($_POST['skills']);
$experience = (int)$_POST['experience'];
$company = $conn->real_escape_string($_POST['company']);

// 1. Check for existing active application (Restrict Multiple Apps)
$check_sql = "SELECT A.applicant_id, S.status 
              FROM applicant A 
              JOIN submissions S ON A.applicant_id = S.applicant_id 
              WHERE A.email = '$email' AND S.status IN ('New', 'Hold')";
$check_res = $conn->query($check_sql);

if ($check_res && $check_res->num_rows > 0) {
    die("<h2>Application Blocked ❌</h2><p>You already have an active application ('New' or 'Hold'). You can only apply again if your previous application is Approved or Rejected.</p><a href='apply.php'>Go Back</a>");
}

// 2. Find if applicant exists (to reuse ID)
$app_res = $conn->query("SELECT applicant_id FROM applicant WHERE email = '$email'");
if ($app_res && $app_res->num_rows > 0) {
    $row = $app_res->fetch_assoc();
    $applicant_id = $row['applicant_id'];
} else {
    // Insert new applicant
    $sql1 = "INSERT INTO applicant (name, email, mobile, dob) VALUES ('$name', '$email', '$mobile', '$dob')";
    if (!$conn->query($sql1)) { die("Error inserting applicant: " . $conn->error); }
    $applicant_id = $conn->insert_id;
}

// 3. Auto-Rejection Rule: Under 18 + NOT an internship role
$age = (int)date_diff(date_create($dob), date_create('today'))->y;
$is_internship = stripos($position, 'intern') !== false;
$auto_rejected = false;

if ($age < 18 && !$is_internship) {
    // Insert submission immediately as Rejected
    $sql2 = "INSERT INTO submissions (applicant_id, position, branch, date_applied, linkedin, relocation, status, decision_timestamp)
             VALUES ('$applicant_id', '$position', '$branch', CURDATE(), '$linkedin', '$relocation', 'Rejected', NOW())";
    if (!$conn->query($sql2)) { die("Error inserting submission: " . $conn->error); }
    $submission_id = $conn->insert_id;
    $auto_rejected = true;
} else {
    // Insert Submission (status is 'New' by default)
    $sql2 = "INSERT INTO submissions (applicant_id, position, branch, date_applied, linkedin, relocation)
             VALUES ('$applicant_id', '$position', '$branch', CURDATE(), '$linkedin', '$relocation')";
    if (!$conn->query($sql2)) { die("Error inserting submission: " . $conn->error); }
    $submission_id = $conn->insert_id;
}

// 4. Insert Background
$sql3 = "INSERT INTO background (applicant_id, skills, experience, last_company)
         VALUES ('$applicant_id', '$skills', '$experience', '$company')";
if (!$conn->query($sql3)) { die("Error inserting background: " . $conn->error); }

// 4b. If auto-rejected, inject a notification message into the inbox
if ($auto_rejected) {
    $conn->query("INSERT INTO Messages (application_id, sender_type, message) VALUES ('$submission_id', 'Admin', 'Your application has been automatically rejected. Applicants must be 18 years or older to apply for non-internship positions.')");
}

// 5. Handle File Uploads (PDF Only)
$upload_dir = __DIR__ . "/uploads/";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if (!empty($_FILES['files']['name'][0])) {
    $file_count = count($_FILES['files']['name']);
    for ($i = 0; $i < $file_count; $i++) {
        $file_name = $_FILES['files']['name'][$i];
        $file_tmp = $_FILES['files']['tmp_name'][$i];
        $file_type = $_FILES['files']['type'][$i];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        // Validate PDF
        if ($file_ext === 'pdf' && $file_type === 'application/pdf') {
            $new_file_name = uniqid("resume_") . ".pdf";
            $target_file = $upload_dir . $new_file_name;

            if (move_uploaded_file($file_tmp, $target_file)) {
                $db_file_name = $conn->real_escape_string($file_name);
                $db_file_path = $conn->real_escape_string("uploads/" . $new_file_name);
                
                $sql4 = "INSERT INTO Files (submission_id, file_name, file_path) 
                         VALUES ('$submission_id', '$db_file_name', '$db_file_path')";
                $conn->query($sql4);
            }
        }
    }
}

if ($auto_rejected) {
    echo "<div style='font-family:sans-serif;padding:30px;'><h2>Application Auto-Rejected ❌</h2>";
    echo "<p style='color:#b00;'>Your application was automatically rejected because you are under 18 and the position is not an internship.</p>";
    echo "<p>You can check the reason in your <a href='applicant_login.php'>Applicant Inbox</a>.</p></div>";
} else {
    echo "<h2>Application Submitted Successfully ✅</h2>";
    echo "<p><a href='index.php'>Return Home</a></p>";
}
?>