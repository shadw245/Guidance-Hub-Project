// Signup Function
async function signupValidation(event) {
    
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const mobile = document.getElementById("signup-mobile").value.trim();
    const country = document.getElementById("signup-country").value;
    const gender = document.querySelector('input[name="gender"]:checked');


    const allowedProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const emailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)$/;

const match = email.match(emailPattern);
if (!match || !allowedProviders.includes(match[1])) {
    alert("Please enter an email from the allowed providers: Gmail, Yahoo, Outlook, Hotmail.");
    return false;
}


    // validate Password 
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
        return false;
    }

    // confirm password matches
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    // Validate phone number (10 digits)
    const phonePattern = /^\d{11}$/;
    if (!phonePattern.test(mobile)) {
        alert("Please enter a valid 11-digit mobile number.");
        return false;
    }

    // Validate country selection
    if (country === "") {
        alert("Please select a country.");
        return false;
    }

    // Validate gender selection
    if (!gender) {
        alert("Please select a gender.");
        return false;
    }


    // Send data to backend
    // Collect gender, country, and mobile if they exist in your form
    const userData = { name, email, gender: gender.value, country, mobile, password };
    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful!");
            document.getElementById("flip").checked = false; // Switch to login form
            return true;
        } else {
            alert(data.message);
            return false;
}
    } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed!");
        return false;
    }
}

// Login Function
function loginValidation(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        window.location.href = "majors.html"; // Redirect on successful login
    } else {
        alert("Invalid email or password!");
    }
}
