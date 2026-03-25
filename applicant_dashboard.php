<?php
session_start();
include 'db.php';

if (!isset($_SESSION['applicant_id'])) {
    header("Location: applicant_login.php");
    exit();
}
$applicant_id = $_SESSION['applicant_id'];

// Get applicant info
$app_res = $conn->query("SELECT * FROM applicant WHERE applicant_id='$applicant_id'");
$applicant = $app_res->fetch_assoc();

// Get submissions
$sub_res = $conn->query("SELECT * FROM submissions WHERE applicant_id='$applicant_id' ORDER BY date_applied DESC, submission_id DESC");

// Handle reply
if (isset($_POST['reply']) && isset($_POST['submission_id']) && !empty($_POST['message'])) {
    $sub_id = (int)$_POST['submission_id'];
    $msg = $conn->real_escape_string($_POST['message']);
    $conn->query("INSERT INTO Messages (application_id, sender_type, message) VALUES ('$sub_id', 'Applicant', '$msg')");
    header("Location: applicant_dashboard.php?sub_id=$sub_id");
    exit();
}

$active_sub_id = isset($_GET['sub_id']) ? (int)$_GET['sub_id'] : 0;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Applicant Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .chat-box { max-height: 400px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 8px;}
        .msg-admin { background: #e2e3e5; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: left; width: fit-content; max-width: 80%; }
        .msg-applicant { background: #cce5ff; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: right; margin-left: auto; width: fit-content; max-width: 80%; }
    </style>
</head>
<body class="bg-light">
<nav class="navbar navbar-dark bg-dark px-4">
    <span class="navbar-brand fw-bold">HireConnect - Applicant Area</span>
    <a href="logout.php" class="btn btn-sm btn-danger">Logout</a>
</nav>
<div class="container mt-4">
    <h2 class="mb-4">Welcome, <?php echo htmlspecialchars($applicant['name']); ?>!</h2>
    
    <div class="row">
        <!-- Applications List -->
        <div class="col-md-4">
            <h4>Your Applications</h4>
            <div class="list-group shadow-sm">
                <?php
                if ($sub_res && $sub_res->num_rows > 0) {
                    while($sub = $sub_res->fetch_assoc()) {
                        if($active_sub_id == 0) $active_sub_id = $sub['submission_id']; // Default to first
                        $isActive = ($active_sub_id == $sub['submission_id']) ? 'active' : '';
                        
                        // Badge logic
                        $badge = 'secondary';
                        if($sub['status'] == 'Approved') $badge = 'success';
                        elseif($sub['status'] == 'Rejected') $badge = 'danger';
                        elseif($sub['status'] == 'Hold') $badge = 'warning text-dark';
                        elseif($sub['status'] == 'New') $badge = 'primary';

                        echo "<a href='?sub_id={$sub['submission_id']}' class='list-group-item list-group-item-action $isActive'>";
                        echo "<strong>" . htmlspecialchars($sub['position']) . "</strong><br>";
                        echo "<span class='badge bg-$badge'>{$sub['status']}</span> <small class='text-muted float-end'>{$sub['date_applied']}</small>";
                        echo "</a>";
                    }
                } else {
                    echo "<p>No applications found.</p>";
                }
                ?>
            </div>
            <a href="apply.php" class="btn btn-outline-primary mt-3 w-100">Submit New Application</a>
        </div>
        
        <!-- Application Inbox -->
        <div class="col-md-8">
            <h4>Application Inbox</h4>
            <?php if ($active_sub_id > 0): ?>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <?php
                        // Fetch active submission status
                        $s_res = $conn->query("SELECT status FROM submissions WHERE submission_id='$active_sub_id'");
                        $s_row = $s_res->fetch_assoc();
                        
                        $badge = 'secondary';
                        if($s_row['status'] == 'Approved') $badge = 'success';
                        elseif($s_row['status'] == 'Rejected') $badge = 'danger';
                        elseif($s_row['status'] == 'Hold') $badge = 'warning text-dark';
                        elseif($s_row['status'] == 'New') $badge = 'primary';
                        
                        echo "<h5>Current Status: <span class='badge bg-$badge'>{$s_row['status']}</span></h5><hr>";
                        ?>
                        
                        <div class="chat-box mb-3">
                            <?php
                            $msg_res = $conn->query("SELECT * FROM Messages WHERE application_id='$active_sub_id' ORDER BY timestamp ASC");
                            if ($msg_res && $msg_res->num_rows > 0) {
                                while($msg = $msg_res->fetch_assoc()) {
                                    $class = ($msg['sender_type'] == 'Admin') ? 'msg-admin' : 'msg-applicant';
                                    $senderName = ($msg['sender_type'] == 'Admin') ? 'Admin' : 'You';
                                    echo "<div class='$class'>";
                                    echo "<strong>$senderName:</strong><br>";
                                    echo nl2br(htmlspecialchars($msg['message'])) . "<br>";
                                    echo "<small class='text-muted' style='font-size:10px;'>{$msg['timestamp']}</small>";
                                    echo "</div>";
                                }
                            } else {
                                echo "<p class='text-muted text-center mt-4'>No messages for this application.</p>";
                            }
                            ?>
                        </div>
                        
                        <!-- Reply Box -->
                        <form method="POST">
                            <input type="hidden" name="submission_id" value="<?php echo $active_sub_id; ?>">
                            <div class="input-group">
                                <input type="text" name="message" class="form-control" placeholder="Type your reply to Admin..." required>
                                <button type="submit" name="reply" class="btn btn-primary">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            <?php else: ?>
                <div class="alert alert-warning shadow-sm">Select an application from the left to view messages.</div>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
</html>
