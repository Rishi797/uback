<?php
include 'db.php';

$id = $_GET['id'];

// Delete child records first
$conn->query("DELETE FROM background WHERE applicant_id=$id");
$conn->query("DELETE FROM submissions WHERE applicant_id=$id");

// Then delete main record
$conn->query("DELETE FROM applicant WHERE applicant_id=$id");

// Redirect
header("Location: view.php");
?>