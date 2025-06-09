/*you can use this function for all maojors pages */
function searchMajors() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let majors = document.querySelectorAll(".major-box");

    majors.forEach(major => {
        let text = major.innerText.toLowerCase();
        if (text.includes(input)) {
            major.classList.remove("hidden"); // Show the element
        } else {
            major.classList.add("hidden"); // Hide the element without affecting layout
        }
    });
    document.getElementById('chatbot').addEventListener('click', function() {
        alert('Chatbot coming soon!');
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const majorSelect = document.getElementById('majorSelect');
    if (majorSelect) {
        majorSelect.addEventListener('change', updateSubMajorOptions); // Trigger sub-major update on major change
    }
  
    const closeModal = document.getElementById("closeModal");
    const chatbot = document.getElementById("chatbot");

    if (closeModal) {
        closeModal.addEventListener("click", function () {
            document.getElementById("modal").style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
        });
    }

    if (chatbot) {
        chatbot.addEventListener("click", function () {
            alert("Chatbot coming soon!");
        });
    }
});

        const subMajors = {   
            "Computer Science": [
                "Software Development",
                "Software Testing",
                "Human-Computer Interaction (HCI)",
                "Cyber Security",
                "Information Systems",
                "Data Science",
                "Artificial Intelligence",
                "Internet of Things (IOT)"
            ],
            "Engineering": [
                "Electronics & Communication",
                "Architecture",
                "Chemicals",
                "Mechanical",
                "Agricultural"
            ],
            "Business": [
                "Finance",
                "Accounting",
                "Marketing",
                "Human Resource",
                "Entrepreneurship",
                "Supply Chain Management"
            ]
        };

        function filterCourses() {
            const selectedMajor = document.getElementById('majorSelect').value;
            const selectedSubMajor = document.getElementById('subMajorSelect').value;
            const selectedStatus = document.getElementById('statusSelect').value;
            const courseCards = document.querySelectorAll('.course-card');

        
            courseCards.forEach(card => {
                const isBooked = card.querySelector('.book-button')?.textContent === "Cancel";
                const majorMatch = card.getAttribute('data-major') === selectedMajor || selectedMajor === "All";
                const subMajorMatch = selectedSubMajor === "All" || card.getAttribute('data-sub-major') === selectedSubMajor;
                const statusMatch = (selectedStatus === "All") ||
                    (selectedStatus === "Booked" && isBooked) ||
                    (selectedStatus === "Not Booked" && !isBooked);
        
                if ((majorMatch && subMajorMatch && statusMatch) ) {
                    card.style.display = 'block';
                }
                else {
                    card.style.display = 'none';
                }               
            });            
        }
        
        function updateSubMajorOptions() {
            const majorSelect = document.getElementById('majorSelect');
            const selectedMajor = majorSelect.value;
            const dropdownContent = document.getElementById('dropdownContent');
        
        // Clear previous options
            dropdownContent.innerHTML = '';

        // Add "All" option
            const allOption = document.createElement('div');
            allOption.textContent = "All";
            allOption.onclick = function () {
                selectSubMajor("All");
            };
            dropdownContent.appendChild(allOption);
        
            // Populate sub-major options based on selected major
            if (selectedMajor in subMajors) {
                subMajors[selectedMajor].forEach(subMajor => {
                    const div = document.createElement('div');
                    div.textContent = subMajor;
                    div.onclick = function () {
                        selectSubMajor(subMajor);
                    };
                    dropdownContent.appendChild(div);
                });
            }
        // Trigger filtering
            filterCourses();
        }
        
        function selectMajor(major) {
            const majorSelect = document.getElementById('majorSelect');
            majorSelect.value = major;
            const majorButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'majorDropdownContent\')"]');
            majorButton.textContent = major; // Update button text to selected major
            updateSubMajorOptions(); // Update sub-major options based on selected major
            filterCourses(); // Reapply filters after selecting major
        }

        function selectSubMajor(subMajor) {
            const subMajorSelect = document.getElementById('subMajorSelect');
            subMajorSelect.value = subMajor;
            const subMajorButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'dropdownContent\')"]');
            subMajorButton.textContent = subMajor; // Update button text to selected sub-major
            filterCourses(); // Reapply filters after selecting sub-major
            
        }
        
        function selectStatus(status) {
            const statusSelect = document.getElementById('statusSelect');
            statusSelect.value = status;
            const statusButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'statusDropdownContent\')"]');
            filterCourses(); // Reapply filters after selecting status
        }
               
        function bookSession(button, mentorship, date, time) {
            const isBooked = button.textContent === "Cancel";
            if (isBooked) {
                // Cancel the booking
                button.textContent = "Book Now";
                removeFromSchedule(mentorship, date, time);
            } else {
                // Book the session
                alert(`You have booked ${mentorship} on ${date} at ${time}.`);
                button.textContent = "Cancel";
                addToSchedule(mentorship, date, time);
            }
            filterCourses(); // Reapply filters after booking
        }
//internship apply now

        function applyInternship(button, internship,duration) {
            const internshipDetails = `${internship}  - ${duration}`;
            const isApplied = button.textContent === "Cancel";
            if (isApplied) {
                // Cancel the application
                button.textContent = "Apply Now";
            } else {
                // Apply for the internship
                alert(`You have applied to ${internship} for ${duration}.`);
                button.textContent = "Cancel";
            }
            filterCourses(); // Reapply filters after applying
        }
        
        function addToSchedule(mentorship, date, time) {
            const month = new Date(date).toLocaleString('en-US', { month: 'long' }).toLowerCase();
            const day = new Date(date).toLocaleString('en-US', { weekday: 'long' });
            const sessionDiv = document.getElementById(`${day.toLowerCase()}-sessions`);
            const sessionEntry = document.createElement('div');
            sessionEntry.textContent = `${mentorship} - ${date} at ${time}`;
            sessionEntry.className = `session-entry ${month}`; // Add month class
            sessionEntry.setAttribute('data-mentorship', mentorship);
            sessionEntry.setAttribute('data-date', date);
            sessionEntry.setAttribute('data-time', time);
            sessionDiv.appendChild(sessionEntry);
        }
        
        function removeFromSchedule(mentorship, date, time) {
            const day = new Date(date).toLocaleString('en-US', { weekday: 'long' });
            const sessionDiv = document.getElementById(`${day.toLowerCase()}-sessions`);
            const sessionEntries = sessionDiv.getElementsByClassName('session-entry');
        
            for (let i = 0; i < sessionEntries.length; i++) {
                if (sessionEntries[i].getAttribute('data-mentorship') === mentorship &&
                    sessionEntries[i].getAttribute('data-date') === date &&
                    sessionEntries[i].getAttribute('data-time') === time) {
                    sessionDiv.removeChild(sessionEntries[i]);
                    break;
                }
            }
        }
        
        // Function to toggle dropdown visibility
        function toggleDropdown(dropdownId) {
            document.getElementById(dropdownId).classList.toggle("show");
        }
        
        // Close the dropdown if the user clicks outside of it
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                const dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    const openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

//logout
    document.addEventListener("DOMContentLoaded", function () {
    const logoutNav = document.getElementById("logoutNav");

    // Check if user is logged in via session
    fetch("/api/auth/check-session") // ✅ Backend route to check session
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                logoutNav.style.display = "block"; // ✅ Show logout button when logged in
            }
        })
        .catch(error => console.error("Session check error:", error));
});

document.getElementById("logoutNav").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default navigation

    fetch("/logout")
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "/login"; // ✅ Redirect to login after logout
        })
        .catch(err => console.error("Logout error:", err));
});
