<?php
session_start();
include 'db.php';

if (isset($_POST['login'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $dob = $conn->real_escape_string($_POST['dob']);

    $res = $conn->query("SELECT applicant_id FROM applicant WHERE email='$email' AND dob='$dob'");
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $_SESSION['applicant_id'] = $row['applicant_id'];
        header("Location: applicant_dashboard.php");
        exit();
    } else {
        $error = "Invalid Email or Date of Birth!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Applicant Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center" style="height:100vh;">
<div class="card p-4 shadow" style="width:350px;">
    <h3 class="text-center mb-3">Applicant Login</h3>
    <?php if(isset($error)) echo "<p class='text-danger text-center'>$error</p>"; ?>
    <form method="POST">
        <label>Email</label>
        <input type="email" name="email" class="form-control mb-2" required>
        <label>Date of Birth</label>
        <input type="date" name="dob" class="form-control mb-3" required>
        <button name="login" class="btn btn-primary w-100">Login</button>
    </form>
    <div class="text-center mt-3"><a href="index.php">Back to Home</a></div>
</div>
</body>
</html>
