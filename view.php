<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

include 'db.php';

// Filter by Status — separated per dashboard to avoid impossible WHERE conditions
$status_filter = isset($_GET['status']) ? $conn->real_escape_string($_GET['status']) : '';

// Active table only shows New/Hold — only apply filter if it matches
$active_statuses = ['New', 'Hold'];
$processed_statuses = ['Approved', 'Rejected'];

$active_cond = '';
if ($status_filter && in_array($status_filter, $active_statuses)) {
    $active_cond = "AND S.status = '$status_filter'";
} elseif ($status_filter && in_array($status_filter, $processed_statuses)) {
    $active_cond = "AND 1=0"; // Filter is for processed — show nothing in active
}

$processed_cond = '';
if ($status_filter && in_array($status_filter, $processed_statuses)) {
    $processed_cond = "AND S.status = '$status_filter'";
} elseif ($status_filter && in_array($status_filter, $active_statuses)) {
    $processed_cond = "AND 1=0"; // Filter is for active — show nothing in processed
}

$sql_active = "SELECT A.applicant_id, A.name, S.submission_id, S.position, S.status, S.date_applied 
               FROM applicant A
               JOIN submissions S ON A.applicant_id = S.applicant_id
               WHERE S.status IN ('New', 'Hold') $active_cond
               ORDER BY S.date_applied DESC, S.submission_id DESC";

$sql_processed = "SELECT A.applicant_id, A.name, S.submission_id, S.position, S.status, S.date_applied, S.decision_timestamp
                  FROM applicant A
                  JOIN submissions S ON A.applicant_id = S.applicant_id
                  WHERE S.status IN ('Approved', 'Rejected') 
                  AND (S.decision_timestamp IS NULL OR S.decision_timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR))
                  $processed_cond
                  ORDER BY S.decision_timestamp DESC";

$res_active = $conn->query($sql_active);
$res_processed = $conn->query($sql_processed);

if (!$res_active || !$res_processed) { die("Query Error: " . $conn->error); }
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<nav class="navbar navbar-dark bg-dark px-4">
    <span class="navbar-brand fw-bold">Admin Dashboard</span>
    <a href="logout.php" class="btn btn-sm btn-danger">Logout</a>
</nav>

<div class="container mt-4">
    
    <!-- Filter -->
    <div class="card p-3 mb-4 shadow-sm border-0">
        <form method="GET" class="d-flex align-items-center">
            <label class="me-2 fw-bold">Filter by Status:</label>
            <select name="status" class="form-control w-25 me-2">
                <option value="">All Statuses</option>
                <option value="New" <?php if($status_filter=='New') echo 'selected';?>>New</option>
                <option value="Hold" <?php if($status_filter=='Hold') echo 'selected';?>>Hold</option>
                <option value="Approved" <?php if($status_filter=='Approved') echo 'selected';?>>Approved</option>
                <option value="Rejected" <?php if($status_filter=='Rejected') echo 'selected';?>>Rejected</option>
            </select>
            <button type="submit" class="btn btn-primary">Apply</button>
            <a href="view.php" class="btn btn-outline-secondary ms-2">Clear</a>
        </form>
    </div>

    <h3>Active Applications</h3>
    <table class="table table-hover shadow-sm bg-white mb-5">
        <thead class="table-primary">
            <tr><th>Name</th><th>Position</th><th>Status</th><th>Date Applied</th><th>Action</th></tr>
        </thead>
        <tbody>
            <?php if ($res_active->num_rows > 0): ?>
                <?php while($row = $res_active->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= htmlspecialchars($row['position']) ?></td>
                        <td><span class="badge bg-<?= $row['status'] == 'Hold' ? 'warning text-dark' : 'primary' ?>"><?= $row['status'] ?></span></td>
                        <td><?= $row['date_applied'] ?></td>
                        <td><a href="review_document.php?id=<?= $row['submission_id'] ?>" class="btn btn-sm btn-dark">Review Document 👉</a></td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="5" class="text-center">No active applications.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <h3>Processed Applications <small class="text-muted" style="font-size:14px;">(Auto-removes after 24 hours)</small></h3>
    <table class="table table-hover shadow-sm bg-white">
        <thead class="table-secondary">
            <tr><th>Name</th><th>Position</th><th>Status</th><th>Decision Time</th><th>Action</th></tr>
        </thead>
        <tbody>
            <?php if ($res_processed->num_rows > 0): ?>
                <?php while($row = $res_processed->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= htmlspecialchars($row['position']) ?></td>
                        <td><span class="badge bg-<?= $row['status'] == 'Approved' ? 'success' : 'danger' ?>"><?= $row['status'] ?></span></td>
                        <td><?= $row['decision_timestamp'] ?></td>
                        <td><a href="review_document.php?id=<?= $row['submission_id'] ?>" class="btn btn-sm btn-outline-dark">View Details</a></td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="5" class="text-center">No processed applications within the last 24 hours.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
</body>
</html>