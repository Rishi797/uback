<?php
session_start();

if (isset($_POST['login'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Prevent SQL injection with simple validation
    if (strlen($user) > 2 && strlen($pass) > 0) {
        if ($user == "admin" && $pass == "123") {
            $_SESSION['admin'] = true;
            header("Location: view.php");
            exit();
        } else {
            $error = "Invalid username or password!";
        }
    } else {
        $error = "Please fill in all fields!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - HireConnect</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Poppins', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            padding: 40px;
            width: 100%;
            max-width: 400px;
            animation: slideInUp 0.5s ease;
        }
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .login-header h2 {
            color: #667eea;
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .login-header p {
            color: #666;
            font-size: 14px;
        }
        .login-icon {
            font-size: 50px;
            color: #667eea;
            margin-bottom: 15px;
        }
        .form-control {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 14px;
            transition: all 0.3s;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background-color: white;
        }
        .form-control-icon {
            border: 2px solid #e0e0e0;
            background: #f8f9fa;
            color: #667eea;
        }
        .login-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            transition: all 0.3s;
            margin-top: 10px;
        }
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            color: white;
        }
        .error-message {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            animation: slideDown 0.3s ease;
        }
        .error-message i {
            margin-right: 10px;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .form-label {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .login-footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .login-footer a {
            color: #667eea;
            text-decoration: none;
            font-size: 13px;
        }
        .login-footer a:hover {
            text-decoration: underline;
        }
        .credential-hint {
            background: #e7f3ff;
            border-left: 4px solid #0066cc;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #0066cc;
        }
        .credential-hint strong {
            display: block;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>

<div class="login-container">
    <!-- Header -->
    <div class="login-header">
        <div class="login-icon">
            <i class="fas fa-lock"></i>
        </div>
        <h2>Admin Login</h2>
        <p>HireConnect Dashboard</p>
    </div>

    <!-- Error Message -->
    <?php if(isset($error)): ?>
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <?php echo htmlspecialchars($error); ?>
        </div>
    <?php endif; ?>



    <!-- Login Form -->
    <form method="POST">
        <div class="mb-3">
            <label class="form-label">Username</label>
            <div class="input-group">
                <span class="input-group-text form-control-icon"><i class="fas fa-user"></i></span>
                <input type="text" name="username" class="form-control" placeholder="Enter username" required autofocus>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-group">
                <span class="input-group-text form-control-icon"><i class="fas fa-key"></i></span>
                <input type="password" name="password" class="form-control" placeholder="Enter password" required>
            </div>
        </div>

        <button type="submit" name="login" class="login-btn w-100">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
    </form>

    <!-- Footer -->
    <div class="login-footer">
        <a href="index.php"><i class="fas fa-home"></i> Back to Home</a>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>