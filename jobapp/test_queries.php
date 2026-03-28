<?php
/**
 * QUERY DEMONSTRATION PAGE
 * Demonstrates: Basic Queries, Complex Queries, Stored Procedures, Views
 * For: Evaluating Queries (20 marks)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

// Determine which query to display
$query_type = isset($_GET['type']) ? $_GET['type'] : 'basic';
$result = null;
$query_display = '';
$description = '';

// Execute queries based on type
switch($query_type) {
    case 'basic':
        $result = $conn->query("SELECT * FROM Applicant LIMIT 5");
        $query_display = "SELECT * FROM Applicant LIMIT 5;";
        $description = "Basic SELECT query - Retrieve all applicants";
        break;
    
    case 'basic_where':
        $result = $conn->query("SELECT name, email FROM Applicant WHERE email LIKE '%@gmail.com'");
        $query_display = "SELECT name, email FROM Applicant WHERE email LIKE '%@gmail.com';";
        $description = "Basic WHERE clause - Filter by email domain";
        break;
    
    case 'basic_order':
        $result = $conn->query("SELECT A.name, B.experience FROM Applicant A 
                               JOIN Background B ON A.applicant_id = B.applicant_id 
                               ORDER BY B.experience DESC");
        $query_display = "SELECT A.name, B.experience FROM Applicant A 
                         JOIN Background B ON A.applicant_id = B.applicant_id 
                         ORDER BY B.experience DESC;";
        $description = "Basic ORDER BY - Sort applicants by experience (descending)";
        break;
    
    case 'complex_join':
        $result = $conn->query("SELECT 
                                A.name,
                                A.email,
                                S.position,
                                S.date_applied,
                                B.experience
                            FROM Applicant A
                            INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
                            INNER JOIN Background B ON A.applicant_id = B.applicant_id
                            ORDER BY B.experience DESC");
        $query_display = "SELECT A.name, A.email, S.position, S.date_applied, B.experience
                         FROM Applicant A
                         INNER JOIN Submissions S ON A.applicant_id = S.applicant_id
                         INNER JOIN Background B ON A.applicant_id = B.applicant_id
                         ORDER BY B.experience DESC;";
        $description = "Complex INNER JOIN - Combine data from 3 tables with multiple conditions";
        break;
    
    case 'left_join':
        $result = $conn->query("SELECT 
                                A.name,
                                COUNT(S.submission_id) AS submission_count,
                                GROUP_CONCAT(S.position) AS positions
                            FROM Applicant A
                            LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
                            GROUP BY A.applicant_id, A.name");
        $query_display = "SELECT A.name, COUNT(S.submission_id) AS submission_count,
                         GROUP_CONCAT(S.position) AS positions
                         FROM Applicant A
                         LEFT JOIN Submissions S ON A.applicant_id = S.applicant_id
                         GROUP BY A.applicant_id, A.name;";
        $description = "LEFT JOIN with GROUP BY - Show all applicants even without submissions";
        break;
    
    case 'subquery':
        $result = $conn->query("SELECT 
                                A.name,
                                B.experience
                            FROM Applicant A
                            JOIN Background B ON A.applicant_id = B.applicant_id
                            WHERE B.experience > (SELECT AVG(experience) FROM Background)");
        $query_display = "SELECT A.name, B.experience
                         FROM Applicant A
                         JOIN Background B ON A.applicant_id = B.applicant_id
                         WHERE B.experience > (SELECT AVG(experience) FROM Background);";
        $description = "Subquery - Find applicants with above-average experience";
        break;
    
    case 'group_by':
        $result = $conn->query("SELECT 
                                S.position,
                                COUNT(*) AS applicant_count,
                                AVG(B.experience) AS avg_experience
                            FROM Submissions S
                            LEFT JOIN Applicant A ON S.applicant_id = A.applicant_id
                            LEFT JOIN Background B ON A.applicant_id = B.applicant_id
                            GROUP BY S.position
                            HAVING applicant_count > 0");
        $query_display = "SELECT S.position, COUNT(*) AS applicant_count,
                         AVG(B.experience) AS avg_experience
                         FROM Submissions S
                         LEFT JOIN Applicant A ON S.applicant_id = A.applicant_id
                         LEFT JOIN Background B ON A.applicant_id = B.applicant_id
                         GROUP BY S.position
                         HAVING applicant_count > 0;";
        $description = "GROUP BY with HAVING - Aggregate data per position";
        break;
    
    case 'multi_join':
        $result = $conn->query("SELECT 
                                A.name,
                                S.position,
                                L.city,
                                V.vision_name,
                                B.experience
                            FROM Applicant A
                            JOIN Submissions S ON A.applicant_id = S.applicant_id
                            JOIN Locate L ON A.applicant_id = L.applicant_id
                            JOIN Background B ON A.applicant_id = B.applicant_id
                            LEFT JOIN Visions V ON S.submission_id = V.submission_id
                            WHERE L.city = 'Mumbai' AND B.experience > 1");
        $query_display = "SELECT A.name, S.position, L.city, V.vision_name, B.experience
                         FROM Applicant A
                         JOIN Submissions S ON A.applicant_id = S.applicant_id
                         JOIN Locate L ON A.applicant_id = L.applicant_id
                         JOIN Background B ON A.applicant_id = B.applicant_id
                         LEFT JOIN Visions V ON S.submission_id = V.submission_id
                         WHERE L.city = 'Mumbai' AND B.experience > 1;";
        $description = "Multiple JOINs with WHERE clause - Complex filtering across 5 tables";
        break;
    
    case 'view_details':
        $result = $conn->query("SELECT * FROM applicant_details_view LIMIT 3");
        $query_display = "SELECT * FROM applicant_details_view LIMIT 3;";
        $description = "VIEW: Applicant Details - Materialized view combining all relationships";
        break;
    
    case 'view_summary':
        $result = $conn->query("SELECT * FROM submission_summary_view");
        $query_display = "SELECT * FROM submission_summary_view;";
        $description = "VIEW: Submission Summary - Aggregated submission statistics per position";
        break;
    
    case 'proc_total':
        $result = $conn->query("CALL total_applicants()");
        $query_display = "CALL total_applicants();";
        $description = "STORED PROCEDURE: Total Applicants - Get overall recruitment statistics";
        break;
    
    case 'proc_position':
        $result = $conn->query("CALL get_applicants_by_position('Software Engineer')");
        $query_display = "CALL get_applicants_by_position('Software Engineer');";
        $description = "STORED PROCEDURE: Get Applicants by Position - Filter using parameter";
        break;
    
    case 'proc_stats':
        $result = $conn->query("CALL get_recruitment_statistics()");
        $query_display = "CALL get_recruitment_statistics();";
        $description = "STORED PROCEDURE: Recruitment Statistics - Comprehensive data summary";
        break;
    
    default:
        $result = $conn->query("SELECT * FROM Applicant LIMIT 5");
        $query_display = "SELECT * FROM Applicant LIMIT 5;";
        $description = "Basic SELECT query";
}

if (!$result) {
    $error_msg = "Query Error: " . $conn->error;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Query Demonstration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Poppins', sans-serif;
            min-height: 100vh;
            padding: 20px;
        }
        .container-main {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 30px;
            max-width: 1100px;
            margin: 0 auto;
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-weight: 700;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .query-type {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 30px;
        }
        .query-btn {
            padding: 10px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.3s;
            text-decoration: none;
            display: block;
            text-align: center;
        }
        .query-btn:hover,
        .query-btn.active {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .query-section {
            background: #f8f9fa;
            border-left: 5px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .query-description {
            color: #666;
            margin-bottom: 10px;
            font-size: 14px;
            font-style: italic;
        }
        code {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 8px;
            display: block;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.5;
        }
        .results-table {
            margin-top: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .results-table thead {
            background: #667eea;
            color: white;
        }
        .results-table td {
            padding: 12px;
        }
        .results-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .no-data {
            text-align: center;
            padding: 30px;
            color: #666;
        }
        .category-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 5px;
        }
        .badge-basic {
            background: #d4edda;
            color: #155724;
        }
        .badge-complex {
            background: #d1ecf1;
            color: #0c5460;
        }
        .badge-view {
            background: #fff3cd;
            color: #856404;
        }
        .badge-proc {
            background: #f8d7da;
            color: #721c24;
        }
        .nav-buttons {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        .section-header {
            color: #667eea;
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
    </style>
</head>
<body>

<div class="container-main">
    <h1>📊 Query Demonstration</h1>
    <p class="subtitle">Basic Queries, Complex Queries, Stored Procedures & Views</p>

    <!-- Query Categories -->
    <h5 class="section-header"><i class="fas fa-database"></i> Basic Queries</h5>
    <div class="query-type">
        <a href="?type=basic" class="query-btn <?php echo ($query_type === 'basic' ? 'active' : ''); ?>">
            <span class="category-badge badge-basic">BASIC</span> All Applicants
        </a>
        <a href="?type=basic_where" class="query-btn <?php echo ($query_type === 'basic_where' ? 'active' : ''); ?>">
            <span class="category-badge badge-basic">BASIC</span> WHERE Clause
        </a>
        <a href="?type=basic_order" class="query-btn <?php echo ($query_type === 'basic_order' ? 'active' : ''); ?>">
            <span class="category-badge badge-basic">BASIC</span> ORDER BY
        </a>
    </div>

    <h5 class="section-header"><i class="fas fa-code-fork"></i> Complex Queries</h5>
    <div class="query-type">
        <a href="?type=complex_join" class="query-btn <?php echo ($query_type === 'complex_join' ? 'active' : ''); ?>">
            <span class="category-badge badge-complex">COMPLEX</span> INNER JOINs
        </a>
        <a href="?type=left_join" class="query-btn <?php echo ($query_type === 'left_join' ? 'active' : ''); ?>">
            <span class="category-badge badge-complex">COMPLEX</span> LEFT JOIN + GROUP
        </a>
        <a href="?type=subquery" class="query-btn <?php echo ($query_type === 'subquery' ? 'active' : ''); ?>">
            <span class="category-badge badge-complex">COMPLEX</span> Subquery
        </a>
        <a href="?type=group_by" class="query-btn <?php echo ($query_type === 'group_by' ? 'active' : ''); ?>">
            <span class="category-badge badge-complex">COMPLEX</span> GROUP BY
        </a>
        <a href="?type=multi_join" class="query-btn <?php echo ($query_type === 'multi_join' ? 'active' : ''); ?>">
            <span class="category-badge badge-complex">COMPLEX</span> Multi-JOIN
        </a>
    </div>

    <h5 class="section-header"><i class="fas fa-eye"></i> Database Views</h5>
    <div class="query-type">
        <a href="?type=view_details" class="query-btn <?php echo ($query_type === 'view_details' ? 'active' : ''); ?>">
            <span class="category-badge badge-view">VIEW</span> Applicant Details
        </a>
        <a href="?type=view_summary" class="query-btn <?php echo ($query_type === 'view_summary' ? 'active' : ''); ?>">
            <span class="category-badge badge-view">VIEW</span> Submission Summary
        </a>
    </div>

    <h5 class="section-header"><i class="fas fa-cogs"></i> Stored Procedures</h5>
    <div class="query-type">
        <a href="?type=proc_total" class="query-btn <?php echo ($query_type === 'proc_total' ? 'active' : ''); ?>">
            <span class="category-badge badge-proc">PROC</span> Total Applicants
        </a>
        <a href="?type=proc_position" class="query-btn <?php echo ($query_type === 'proc_position' ? 'active' : ''); ?>">
            <span class="category-badge badge-proc">PROC</span> By Position
        </a>
        <a href="?type=proc_stats" class="query-btn <?php echo ($query_type === 'proc_stats' ? 'active' : ''); ?>">
            <span class="category-badge badge-proc">PROC</span> Statistics
        </a>
    </div>

    <!-- Query Display -->
    <div class="query-section">
        <div class="query-description">
            <strong>📝 Description:</strong> <?php echo $description; ?>
        </div>
        <strong>SQL Query:</strong>
        <code><?php echo htmlspecialchars($query_display); ?></code>
    </div>

    <!-- Results -->
    <h5 style="color: #667eea; font-weight: 700; margin-top: 30px;">📋 Results</h5>

    <?php
    if (isset($error_msg)) {
        echo "<div class='alert alert-danger'>" . htmlspecialchars($error_msg) . "</div>";
    } elseif ($result) {
        if ($result->num_rows > 0) {
            echo "<table class='table table-bordered results-table'>";
            echo "<thead><tr>";
            
            // Get field names
            $fields = $result->fetch_fields();
            foreach ($fields as $field) {
                echo "<th>" . htmlspecialchars($field->name) . "</th>";
            }
            echo "</tr></thead>";
            echo "<tbody>";
            
            // Display data
            $result->data_seek(0);
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>" . htmlspecialchars($value ?? 'NULL') . "</td>";
                }
                echo "</tr>";
            }
            echo "</tbody></table>";
            echo "<p class='text-muted mt-3'>Total rows: <strong>" . $result->num_rows . "</strong></p>";
        } else {
            echo "<div class='no-data'>❌ No data found for this query</div>";
        }
    }
    ?>

    <!-- Navigation -->
    <div class="nav-buttons">
        <a href="test_db.php" class="btn btn-info">← Database Connectivity Test</a>
        <a href="index.php" class="btn btn-primary">Home</a>
        <a href="view.php" class="btn btn-success">Admin Dashboard →</a>
    </div>
</div>

</body>
</html>
