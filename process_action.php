<?php
session_start();
include 'db.php';

if (!isset($_SESSION['admin'])) {
    die("Unauthorized.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && isset($_POST['submission_id'])) {
    $submission_id = (int)$_POST['submission_id'];
    $action = $_POST['action'];

    // action values must match DB ENUM: 'Approved', 'Hold', 'Rejected'
    if (in_array($action, ['Approved', 'Hold', 'Rejected'])) {
        // Update status and timestamp
        $conn->query("UPDATE submissions SET status='$action', decision_timestamp=NOW() WHERE submission_id='$submission_id'");

        // Generate auto notification
        $auto_msg = "";
        if ($action == 'Approved') {
            $auto_msg = "Congratulations! Your application has been Approved.";
        } elseif ($action == 'Hold') {
            $auto_msg = "Your application is currently On Hold / Under Review. We will get back to you soon.";
        } elseif ($action == 'Rejected') {
            $auto_msg = "We regret to inform you that your application has been Rejected at this time.";
        }

        // Insert into Messages
        $conn->query("INSERT INTO Messages (application_id, sender_type, message) VALUES ('$submission_id', 'Admin', '$auto_msg')");
        
        // Redirect back to dashboard
        header("Location: view.php");
        exit();
    }
}
header("Location: view.php");
?>
