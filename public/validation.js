function validateForm() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("email").value;
  let password = document.forms["signupForm"]["password"].value;
  let confirmPassword = document.forms["signupForm"]["confirmPassword"].value;
  let phone = document.forms["signupForm"]["phone"].value;
  let valid = true;

  // Reset error messages
  document.getElementById("firstNameError").textContent = "";
  document.getElementById("lastNameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  // Validate First Name
  if (!firstName) {
    document.getElementById("firstNameError").textContent =
      "First Name is required.";
    valid = false;
  }

  // Validate Last Name
  if (!lastName) {
    document.getElementById("lastNameError").textContent =
      "Last Name is required.";
    valid = false;
  }

  // Validate Email
  let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent =
      "Invalid email address.";
    valid = false;
  }

  // Validate Password
  let passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!passwordPattern.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must be at least 8 characters long and contain 1 capital letter and 1 special character.";
    valid = false;
  }

  // Validate Confirm Password
  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").textContent =
      "Passwords do not match.";
    valid = false;
  }
  // Validate Phone Number
  let phonePattern = /^\d{8}$/;
  if (!phonePattern.test(phone)) {
    document.getElementById("phoneError").textContent =
      "Phone number must be an 8-digit number.";
    valid = false;
  }

  return valid;
}
