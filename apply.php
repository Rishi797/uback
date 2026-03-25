<!DOCTYPE html>
<html>
<head>
    <title>Apply</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
<div class="card p-4 animate__animated animate__fadeInUp">
<div class="container mt-5">
    <div class="card p-4">

        <h3 class="text-center fw-bold mb-4">Job Application</h3>

        <!-- FORM START -->
        <form action="submit.php" method="POST" enctype="multipart/form-data" onsubmit="return validateForm()">

    <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-user"></i></span>
        <input class="form-control" name="name" id="name" placeholder="Full Name">
    </div>

    <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-envelope"></i></span>
        <input class="form-control" name="email" id="email" placeholder="Email">
    </div>

    <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-phone"></i></span>
        <input class="form-control" name="mobile" placeholder="Mobile Number">
    </div>

    <input class="form-control mb-3" type="date" name="dob">

    <hr>

    <h5>Job Details</h5>

    <input class="form-control mb-3" name="position" placeholder="Position Applied">
    <input class="form-control mb-3" name="branch" placeholder="Branch">
    <input class="form-control mb-3" name="linkedin" placeholder="LinkedIn Profile">

    <select class="form-control mb-3" name="relocation">
        <option value="">Relocation Preference</option>
        <option>Yes</option>
        <option>No</option>
    </select>

    <hr>

    <h5>Background</h5>

    <input class="form-control mb-3" name="skills" placeholder="Skills">
    <input class="form-control mb-3" name="experience" placeholder="Experience">
    <input class="form-control mb-3" name="company" placeholder="Last Company">

    <label class="form-label mt-2">Upload Resumes/Certificates (PDF only)</label>
    <input class="form-control mb-3" type="file" name="files[]" accept="application/pdf" multiple required>

    <button class="btn btn-success w-100 mt-3">
        Submit Application
    </button>

</form>
        <!-- FORM END -->

    </div>
</div>
<script>
function validateForm() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name === "" || email === "") {
        alert("Name and Email are required!");
        return false;
    }

    if (!email.includes("@")) {
        alert("Enter a valid email!");
        return false;
    }

    alert("Form looks good! Submitting...");
    return true;
}
</script>
</body>
</html>