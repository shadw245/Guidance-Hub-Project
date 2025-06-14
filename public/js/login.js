// Signup Function
function validateSignupForm() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const mobile = document.getElementById("signup-mobile").value.trim();
    const country = document.getElementById("signup-country").value;
    const gender = document.querySelector('input[name="gender"]:checked');

    // ✅ Validate email
    const allowedProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const emailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)$/;
    const match = email.match(emailPattern);
    if (!match || !allowedProviders.includes(match[1])) {
        alert("Please enter an email from the allowed providers: Gmail, Yahoo, Outlook, Hotmail.");
        return false;
    }

    // ✅ Validate password
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*/])[A-Za-z\d!@#$%^&*/]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
        return false;
    }

    // ✅ Check password match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    // ✅ Validate phone number (11 digits)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(mobile)) {
        alert("Please enter a valid 11-digit mobile number.");
        return false;
    }

    // ✅ Ensure country & gender are selected
    if (!country) {
        alert("Please select a country.");
        return false;
    }
    if (!gender) {
        alert("Please select a gender.");
        return false;
    }

    return { name, email, gender: gender.value, country, mobile, password }; 
}

async function signupValidation(event) {
    event.preventDefault(); 

    const userData = validateSignupForm();
    if (!userData) return; 

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = "/login"; 
        } else {
            alert(data.message || "Signup failed! Please try again.");
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed! Please check your connection.");
    }
}

async function loginValidation(event) {
    event.preventDefault(); // Stop default form submission

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();        if (response.ok) {
            alert(data.message);
            window.location.href = data.redirect; // ✅ Redirect user after login
        } else {
            // Show error message without redirecting
            alert(data.message || "Invalid email or password. Please try again.");
            // Clear the password field for security
            document.getElementById("login-password").value = "";
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed!");
    }
}