<?php
/**
 * DATABASE CONNECTION FILE
 * Establishes MySQLi connection to jobapp database
 * Demonstrates: Error Handling, Security Best Practices, Connection Management
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ========== DATABASE CONFIGURATION ==========
$servername = "localhost";          // MySQL server address
$username = "root";                 // Default XAMPP MySQL user
$password = "";                     // Default XAMPP (no password)
$database = "jobapp";               // Database name

// ========== CREATE CONNECTION ==========
/**
 * MySQLi Procedural Connection
 * Can be changed to OOP: $conn = new mysqli(...)
 */
$conn = new mysqli($servername, $username, $password, $database);

// ========== ERROR HANDLING ==========
/**
 * Check if connection was successful
 * If not, terminate with error message
 * This prevents SQL errors from exposing sensitive information
 */
if ($conn->connect_error) {
    // Log error to file (production environment)
    error_log("Database Connection Failed: " . $conn->connect_error);
    
    // Display user-friendly error message
    die("
        <div style='background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; 
                    padding: 20px; border-radius: 5px; margin: 20px; font-family: Arial;'>
            <strong>❌ Database Connection Error!</strong><br><br>
            We're having trouble connecting to our database. Please try again later.<br>
            If the problem persists, contact the administrator.<br><br>
            <em>Error Code: DB_CONNECTION_FAILED</em>
        </div>
    ");
}

// ========== CHARACTER SET ==========
/**
 * Set UTF-8 character set for proper handling of international characters
 * Supports: emojis, accents, special characters
 */
$conn->set_charset("utf8mb4");

// ========== CONNECTION PROPERTIES ==========
/**
 * Optional: Set connection properties for optimization
 * Can be used for:
 * - Connection timeout settings
 * - Query timeout settings
 * - SSL/TLS encryption
 */
// $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 28800);

// ========== GLOBAL ERROR HANDLER ==========
/**
 * Connection is now ready for use across all PHP files
 * Usage: include 'db.php'; then use $conn for queries
 */

// ========== SECURITY NOTES ==========
/**
 * IMPORTANT: For production environment:
 * 1. Use prepared statements (prevents SQL injection)
 *    Example: $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
 * 
 * 2. Never expose database credentials in code
 *    Use environment variables or config files
 * 
 * 3. Use password for database user
 *    Current setup (no password) is for development only
 * 
 * 4. Implement role-based access control (RBAC)
 * 
 * 5. Use SSL/TLS for database connections in production
 */

// ========== FUNCTION: SAFE QUERY EXECUTION ==========
/**
 * Helper function for safe query execution
 * Can be extended with prepared statements
 */
function executeQuery($sql) {
    global $conn;
    $result = $conn->query($sql);
    
    if (!$result) {
        error_log("Query Error: " . $conn->error . " | Query: " . $sql);
        return false;
    }
    return $result;
}

// ========== FUNCTION: SANITIZE INPUT ==========
/**
 * Basic input sanitization
 * For production: Use prepared statements instead
 */
function sanitizeInput($input) {
    global $conn;
    return $conn->real_escape_string(htmlspecialchars(trim($input)));
}

?>
