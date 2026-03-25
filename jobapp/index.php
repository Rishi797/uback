<!DOCTYPE html>
<html>
<head>
    <title>HireConnect - Job Application Platform</title>
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
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
        /* Navbar */
        .navbar {
            background: rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 15px 30px;
        }
        .navbar-brand {
            font-size: 24px;
            font-weight: 700;
            color: white !important;
            letter-spacing: 1px;
        }
        .navbar-brand i {
            margin-right: 10px;
            color: #ffd700;
        }
        /* Hero Section */
        .hero-section {
            min-height: 90vh;
            display: flex;
            align-items: center;
            padding: 40px 20px;
        }
        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: center;
        }
        .hero-text h1 {
            font-size: 48px;
            font-weight: 700;
            color: white;
            line-height: 1.2;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        .hero-text p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .hero-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .btn-hero {
            padding: 15px 35px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            border: none;
            cursor: pointer;
        }
        .btn-primary-hero {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #333;
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
        }
        .btn-primary-hero:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
            color: #333;
            text-decoration: none;
        }
        .btn-primary-hero i {
            margin-right: 8px;
        }
        .btn-secondary-hero {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            backdrop-filter: blur(10px);
        }
        .btn-secondary-hero:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
            color: white;
            text-decoration: none;
        }
        .hero-image {
            position: relative;
        }
        .hero-image img {
            width: 100%;
            max-width: 400px;
            filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        /* Features Section */
        .features-section {
            background: white;
            padding: 60px 20px;
            margin-top: 40px;
        }
        .features-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .features-title {
            text-align: center;
            font-size: 36px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 50px;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .feature-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            text-align: center;
            border-top: 4px solid #667eea;
        }
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
        }
        .feature-icon {
            font-size: 40px;
            color: #667eea;
            margin-bottom: 15px;
        }
        .feature-card h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        .feature-card p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        /* Footer */
        .footer {
            background: #2d2d2d;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }
        /* Responsive */
        @media (max-width: 768px) {
            .hero-text h1 {
                font-size: 32px;
            }
            .hero-content {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            .hero-section {
                min-height: auto;
            }
        }
    </style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.php">
            <i class="fas fa-briefcase"></i> HireConnect
        </a>
        <div class="ms-auto">
            <a href="login.php" class="btn btn-sm btn-warning" style="color: #333; font-weight: 600;">
                <i class="fas fa-lock"></i> Admin Login
            </a>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<div class="hero-section">
    <div class="hero-container">
        <div class="hero-content">
            <!-- Left Side - Text -->
            <div class="hero-text">
                <h1>Get Hired Faster 🚀</h1>
                <p>HireConnect is your smart job application management platform. Apply to amazing opportunities, track your progress, and land your dream job.</p>
                <div class="hero-buttons">
                    <a href="apply.php" class="btn-hero btn-primary-hero">
                        <i class="fas fa-arrow-right"></i> Apply Now
                    </a>
                    <a href="test_db.php" class="btn-hero btn-secondary-hero">
                        <i class="fas fa-database"></i> View Demo
                    </a>
                </div>
            </div>
            <!-- Right Side - Image -->
            <div class="hero-image">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Job Application">
            </div>
        </div>
    </div>
</div>

<!-- Features Section -->
<div class="features-section">
    <div class="features-container">
        <h2 class="features-title"><i class="fas fa-star"></i> Why Choose HireConnect?</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-file-alt"></i></div>
                <h3>Easy Application</h3>
                <p>Fill out your application in minutes with our simplified form. No unnecessary fields, just what matters.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
                <h3>Track Progress</h3>
                <p>Monitor your job applications in real-time and see your submission status at a glance.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                <h3>Secure & Safe</h3>
                <p>Your data is protected with industry-standard security measures. Privacy is our priority.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-search"></i></div>
                <h3>Smart Matching</h3>
                <p>Advanced algorithms help match your profile with the best opportunities for you.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-users"></i></div>
                <h3>Community Support</h3>
                <p>Connect with other job seekers and share your experiences in our growing community.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-rocket"></i></div>
                <h3>Career Growth</h3>
                <p>Access exclusive resources to enhance your skills and advance your career journey.</p>
            </div>
        </div>
    </div>
</div>

<!-- Footer -->
<div class="footer">
    <p>&copy; 2026 HireConnect. All rights reserved. | Built with <i class="fas fa-heart" style="color: #ff6b6b;"></i> for Developers</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>