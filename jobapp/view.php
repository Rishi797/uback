<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// 🔒 Protect page
if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit();
}

include 'db.php';

// 📊 Total count
$count = $conn->query("SELECT COUNT(*) as total FROM applicant")->fetch_assoc();

// 🔍 Search
$search = "";
if (isset($_GET['search'])) {
    $search = $_GET['search'];
}

// 📄 Main query
$sql = "SELECT A.applicant_id, A.name, A.email, S.position, B.experience, L.city, L.branch AS loc_branch, V.vision_name
        FROM applicant A
        JOIN submissions S ON A.applicant_id = S.applicant_id
        JOIN background B ON A.applicant_id = B.applicant_id
        JOIN locate L ON A.applicant_id = L.applicant_id
        LEFT JOIN visions V ON S.submission_id = V.submission_id";

if (!empty($search)) {
    $sql .= " WHERE A.name LIKE '%$search%' OR S.position LIKE '%$search%' OR L.city LIKE '%$search%'";
}

$result = $conn->query($sql);

if (!$result) {
    die("Query Error: " . $conn->error);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(to right, #667eea, #764ba2);
            font-family: 'Poppins', sans-serif;
        }

        .container {
            background: white;
            padding: 20px;
            border-radius: 12px;
        }

        .table {
            border-radius: 10px;
            overflow: hidden;
        }

        .btn {
            border-radius: 8px;
        }
    </style>
</head>

<body>

<div class="container mt-5">

    <h2 class="mb-4 text-center fw-bold">All Applications</h2>

    <!-- Logout -->
    <a href="logout.php" class="btn btn-danger mb-3">Logout</a>

    <!-- Total -->
    <div class="alert alert-info">
        Total Applications: <strong><?php echo $count['total']; ?></strong>
    </div>

    <!-- Back -->
    <a href="index.php" class="btn btn-secondary mb-3">⬅ Back</a>

    <!-- Search -->
    <form method="GET" class="mb-3">
        <input type="text" name="search" class="form-control"
               placeholder="Search by name or position"
               value="<?php echo htmlspecialchars($search); ?>">
    </form>

    <!-- Table -->
    <table class="table table-bordered table-hover shadow bg-white">
        <thead class="table-dark">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Experience</th>
                <th>City</th>
                <th>Location Branch</th>
                <th>Vision</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>" . htmlspecialchars($row['name']) . "</td>
                        <td>" . htmlspecialchars($row['email']) . "</td>
                        <td>" . htmlspecialchars($row['position']) . "</td>
                        <td>" . htmlspecialchars($row['experience']) . "</td>
                        <td>" . htmlspecialchars($row['city']) . "</td>
                        <td>" . htmlspecialchars($row['loc_branch']) . "</td>
                        <td>" . htmlspecialchars($row['vision_name']) . "</td>
                        <td>
                            <a href='delete.php?id=" . $row['applicant_id'] . "' 
                               class='btn btn-danger btn-sm'>
                               Delete
                            </a>
                        </td>
                      </tr>";
            }
        } else {
            echo "<tr><td colspan='8' class='text-center'>No data found</td></tr>";
        }
        ?>
        </tbody>
    </table>

</div>

</body>
</html>