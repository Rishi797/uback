<!DOCTYPE html>
<html>
<head>
    <title>Job Application - HireConnect</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
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
            padding: 30px 20px;
        }
        .navbar {
            background: rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(10px);
            margin-bottom: 30px;
        }
        .navbar-brand {
            color: white !important;
            font-weight: 700;
            font-size: 20px;
        }
        .navbar-brand i {
            margin-right: 8px;
            color: #ffd700;
        }
        .form-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            padding: 40px;
            max-width: 700px;
            margin: 0 auto;
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
        .form-title {
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 35px;
        }
        .form-title i {
            margin-right: 10px;
        }
        .section-header {
            font-size: 14px;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 25px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .form-control, .form-select {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 14px;
            transition: all 0.3s;
        }
        .form-control:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background-color: white;
        }
        .form-label {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .input-group-text {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            color: #667eea;
        }
        .input-group-text i {
            font-size: 16px;
        }
        .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            margin-top: 30px;
            transition: all 0.3s;
            font-size: 16px;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            color: white;
        }
        .btn-back {
            margin-top: 20px;
        }
        .required {
            color: #e74c3c;
        }
        .form-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>

<body>

<!-- Navbar -->
<nav class="navbar navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.php">
            <i class="fas fa-briefcase"></i> HireConnect
        </a>
    </div>
</nav>

<!-- Form Container -->
<div class="form-container">
    <h3 class="form-title">
        <i class="fas fa-file-contract"></i> Job Application Form
    </h3>

    <!-- FORM START -->
    <form action="submit.php" method="POST" onsubmit="return validateForm()" id="applicationForm">

        <!-- Personal Information Section -->
        <h5 class="section-header"><i class="fas fa-user"></i> Personal Information</h5>
        
        <div class="mb-3">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
                <input class="form-control" name="name" id="name" placeholder="e.g. John Doe" required>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Email Address <span class="required">*</span></label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                <input class="form-control" name="email" id="email" type="email" placeholder="e.g. john@example.com" required>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Mobile Number</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-phone"></i></span>
                <input class="form-control" name="mobile" placeholder="e.g. 9876543210" pattern="[0-9]{10}">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Date of Birth</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-calendar"></i></span>
                <input class="form-control" type="date" name="dob">
            </div>
        </div>

        <!-- Job Details Section -->
        <h5 class="section-header"><i class="fas fa-briefcase"></i> Job Details</h5>

        <div class="mb-3">
            <label class="form-label">Position Applied <span class="required">*</span></label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-tasks"></i></span>
                <input class="form-control" name="position" id="position" placeholder="e.g. Software Engineer" required>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Branch</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-code-branch"></i></span>
                <input class="form-control" name="branch" placeholder="e.g. CSE, IT, ECE">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">LinkedIn Profile</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fab fa-linkedin"></i></span>
                <input class="form-control" name="linkedin" placeholder="linkedin.com/in/yourprofile">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Relocation Willingness</label>
            <select class="form-select" name="relocation">
                <option value="">-- Select an option --</option>
                <option value="Yes">✓ Yes, I'm willing to relocate</option>
                <option value="No">✗ No, I prefer current location</option>
            </select>
        </div>

        <!-- Location Details Section -->
        <h5 class="section-header"><i class="fas fa-map-pin"></i> Location Details</h5>

        <div class="mb-3">
            <label class="form-label">City</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-city"></i></span>
                <input class="form-control" name="loc_city" placeholder="e.g. Mumbai, Bangalore, Delhi">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Location Branch</label>
            <input class="form-control" name="loc_branch" placeholder="e.g. Main Office, Remote">
        </div>

        <div class="mb-3">
            <label class="form-label">Contact Mobile</label>
            <input class="form-control" name="loc_mobile" placeholder="e.g. 9876543210">
        </div>

        <div class="mb-3">
            <label class="form-label">Preferred Position</label>
            <input class="form-control" name="loc_position" placeholder="e.g. Software Engineer, Data Analyst">
        </div>

        <!-- Career Vision Section -->
        <h5 class="section-header"><i class="fas fa-star"></i> Career Vision</h5>

        <div class="mb-3">
            <label class="form-label">Vision Name</label>
            <input class="form-control" name="vision_name" placeholder="e.g. Full-stack Developer, Tech Lead">
        </div>

        <div class="mb-3">
            <label class="form-label">Vision Skills</label>
            <textarea class="form-control" name="vision_skills" rows="2" placeholder="Skills you want to develop (comma-separated)"></textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Vision Description</label>
            <textarea class="form-control" name="vision_description" rows="2" placeholder="Describe your career goals"></textarea>
        </div>

        <!-- Background Section -->
        <h5 class="section-header"><i class="fas fa-graduation-cap"></i> Professional Background</h5>

        <div class="mb-3">
            <label class="form-label">Skills <span class="required">*</span></label>
            <textarea class="form-control" name="skills" rows="2" placeholder="e.g. Java, Python, SQL, React (comma-separated)" required></textarea>
            <small class="form-text">List your technical skills separated by commas</small>
        </div>

        <div class="mb-3">
            <label class="form-label">Years of Experience</label>
            <div class="input-group">
                <input class="form-control" name="experience" type="number" min="0" placeholder="e.g. 2">
                <span class="input-group-text">Years</span>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Last Company</label>
            <input class="form-control" name="company" placeholder="e.g. ABC Corporation">
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-submit w-100">
            <i class="fas fa-paper-plane"></i> Submit Application
        </button>

        <div class="text-center btn-back">
            <a href="index.php" class="btn btn-outline-secondary">← Back to Home</a>
        </div>

    </form>
    <!-- FORM END -->
</div>

<script>
function validateForm() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let position = document.getElementById("position").value.trim();
    let skills = document.querySelector("textarea[name='skills']").value.trim();

    // Check required fields
    if (name === "") {
        alert("❌ Name is required!");
        return false;
    }

    if (email === "") {
        alert("❌ Email is required!");
        return false;
    }

    // Email validation
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("❌ Please enter a valid email address!");
        return false;
    }

    if (position === "") {
        alert("❌ Position applied is required!");
        return false;
    }

    if (skills === "") {
        alert("❌ Please mention at least one skill!");
        return false;
    }

    alert("✅ Form validation successful! Submitting...");
    return true;
}
</script>

</body>
</html>