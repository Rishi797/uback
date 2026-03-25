<?php
$servername = "localhost";
$username = "root";
$password = "";
$port = 3307;

$conn = new mysqli($servername, $username, $password, "", $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Recreate database
$conn->query("DROP DATABASE IF EXISTS jobapp");
$conn->query("CREATE DATABASE jobapp");
$conn->query("USE jobapp");

// Execute SQL commands from file
$sql = file_get_contents("project.sql");

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "Database resetted and project.sql imported successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
