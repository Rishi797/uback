<?php
include 'db.php';

// Show columns of submissions
$result = $conn->query("SHOW COLUMNS FROM submissions");
echo "<h3>Columns:</h3><pre>";
while($row = $result->fetch_assoc()) { print_r($row); }
echo "</pre>";

// Force update submission 2 to Approved
$conn->query("UPDATE submissions SET status='Approved', decision_timestamp=NOW() WHERE submission_id=2");
echo "<b>Update error: </b>" . ($conn->error ?: "none") . " | Affected: " . $conn->affected_rows . "<br>";

// Show all submissions
$r = $conn->query("SELECT submission_id, status, decision_timestamp FROM submissions");
echo "<h3>All submissions after update:</h3><pre>";
while($row = $r->fetch_assoc()) { print_r($row); }
echo "</pre>";
?>
