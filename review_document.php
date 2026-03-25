<?php
session_start();
include 'db.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

$submission_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$app_sql = "SELECT A.*, S.*, B.* 
            FROM submissions S
            JOIN applicant A ON S.applicant_id = A.applicant_id
            JOIN background B ON S.applicant_id = B.applicant_id
            WHERE S.submission_id = '$submission_id'";
$app_res = $conn->query($app_sql);

if (!$app_res || $app_res->num_rows == 0) {
    die("Application not found.");
}
$data = $app_res->fetch_assoc();

// Get Files
$files_res = $conn->query("SELECT * FROM Files WHERE submission_id='$submission_id'");

// Handle Chat Message Sending
if (isset($_POST['send_msg']) && !empty($_POST['message'])) {
    $msg = $conn->real_escape_string($_POST['message']);
    $conn->query("INSERT INTO Messages (application_id, sender_type, message) VALUES ('$submission_id', 'Admin', '$msg')");
    header("Location: review_document.php?id=$submission_id");
    exit();
}

// Get Chat Messages
$msg_res = $conn->query("SELECT * FROM Messages WHERE application_id='$submission_id' ORDER BY timestamp ASC");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Review Application</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .chat-box { max-height: 400px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 8px;}
        .msg-admin { background: #cce5ff; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: right; margin-left: auto; width: fit-content; max-width: 80%; }
        .msg-applicant { background: #e2e3e5; padding: 10px; border-radius: 10px; margin-bottom: 10px; text-align: left; width: fit-content; max-width: 80%; }
    </style>
</head>
<body class="bg-light">
<nav class="navbar navbar-dark bg-dark px-4">
    <span class="navbar-brand fw-bold">Reviewing Application #<?= $submission_id ?></span>
    <div>
        <a href="view.php" class="btn btn-sm btn-outline-light me-2">Back to Dashboard</a>
        <a href="logout.php" class="btn btn-sm btn-danger">Logout</a>
    </div>
</nav>

<div class="container mt-4">
    <div class="row">
        <!-- Applicant Details -->
        <div class="col-md-7">
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-header bg-white">
                    <h4 class="mb-0"><?= htmlspecialchars($data['name']) ?> 
                        <?php
                            $badge = 'secondary';
                            if($data['status'] == 'Approved') $badge = 'success';
                            elseif($data['status'] == 'Rejected') $badge = 'danger';
                            elseif($data['status'] == 'Hold') $badge = 'warning text-dark';
                            elseif($data['status'] == 'New') $badge = 'primary';
                        ?>
                        <span class="badge bg-<?= $badge ?> float-end"><?= $data['status'] ?></span>
                    </h4>
                </div>
                <div class="card-body">
                    <p><strong>Email:</strong> <?= htmlspecialchars($data['email']) ?> | <strong>Mobile:</strong> <?= htmlspecialchars($data['mobile']) ?></p>
                    <p><strong>Position:</strong> <?= htmlspecialchars($data['position']) ?> (<?= htmlspecialchars($data['branch']) ?>)</p>
                    <p><strong>Experience:</strong> <?= htmlspecialchars($data['experience']) ?> Years</p>
                    <p><strong>Skills:</strong> <?= htmlspecialchars($data['skills']) ?></p>
                    <p><strong>Last Company:</strong> <?= htmlspecialchars($data['last_company']) ?></p>
                    <hr>
                    <h5>Attached PDF Documents</h5>
                    <?php if ($files_res && $files_res->num_rows > 0): ?>
                        <ul class="list-group list-group-flush">
                            <?php while($f = $files_res->fetch_assoc()): ?>
                                <li class="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 rounded border">
                                    📄 <?= htmlspecialchars($f['file_name']) ?>
                                    <a href="<?= htmlspecialchars($f['file_path']) ?>" target="_blank" class="btn btn-sm btn-primary">View / Download</a>
                                </li>
                            <?php endwhile; ?>
                        </ul>
                    <?php else: ?>
                        <p class="text-muted">No files uploaded.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Decision Buttons -->
            <div class="card shadow-sm border-0 mb-4 bg-white">
                <div class="card-body text-center">
                    <h5>Final Decision</h5>
                    <form action="process_action.php" method="POST" class="mt-3">
                        <input type="hidden" name="submission_id" value="<?= $submission_id ?>">
                        <button type="submit" name="action" value="Approved" class="btn btn-success btn-lg me-2">✅ Approve</button>
                        <button type="submit" name="action" value="Hold" class="btn btn-warning btn-lg me-2 text-dark">⏸ Hold</button>
                        <button type="submit" name="action" value="Rejected" class="btn btn-danger btn-lg">❌ Reject</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Admin-Applicant Chat -->
        <div class="col-md-5">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white">
                    <h5 class="mb-0">Chat with Applicant</h5>
                </div>
                <div class="card-body">
                    <div class="chat-box mb-3">
                        <?php
                        if ($msg_res && $msg_res->num_rows > 0) {
                            while($msg = $msg_res->fetch_assoc()) {
                                $class = ($msg['sender_type'] == 'Admin') ? 'msg-admin' : 'msg-applicant';
                                $senderName = ($msg['sender_type'] == 'Admin') ? 'You' : 'Applicant';
                                echo "<div class='$class'>";
                                echo "<strong>$senderName:</strong><br>";
                                echo nl2br(htmlspecialchars($msg['message'])) . "<br>";
                                echo "<small class='text-muted' style='font-size:10px;'>{$msg['timestamp']}</small>";
                                echo "</div>";
                            }
                        } else {
                            echo "<p class='text-muted text-center mt-4'>No messages yet. Send a message to open a clarification request.</p>";
                        }
                        ?>
                    </div>
                    
                    <form method="POST">
                        <div class="input-group">
                            <input type="text" name="message" class="form-control" placeholder="Ask applicant a question..." required>
                            <button type="submit" name="send_msg" class="btn btn-dark">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
