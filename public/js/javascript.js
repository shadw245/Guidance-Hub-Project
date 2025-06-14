/*chatbot*/

        function appendMessage(sender, text) {
            const chat = document.getElementById('chat');
            chat.innerHTML += `<b style="color:${sender==='You'?'#007BFF':'#444'}">${sender}:</b> ${text}<br>`;
            chat.scrollTop = chat.scrollHeight;
        }
        async function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            if (!message) return;
            appendMessage('You', message);
            input.value = '';
            try {
                const res = await fetch('/chat/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                appendMessage('Bot', data.reply);
            } catch (err) {
                appendMessage('Bot', 'Chatbot is not available. Please try again later.');
            }
        }
        document.getElementById('userInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendMessage();
        });

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
}
document.addEventListener("DOMContentLoaded", function () {
    const majorSelect = document.getElementById('majorSelect');
    if (majorSelect) {
        majorSelect.addEventListener('change', updateSubMajorOptions); // Trigger sub-major update on major change
    }
  
    const closeModal = document.getElementById("closeModal");
    

    if (closeModal) {
        closeModal.addEventListener("click", function () {
            document.getElementById("modal").style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
        });
    }

    fetch("/api/auth/check-session")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                const logoutNav = document.getElementById("logoutNav");
                if (logoutNav) {
                    logoutNav.style.display = "block";
                }
            }
        })
        .catch(error => console.error('Error checking session:', error));

    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/logout')
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/website';
                    }
                })
                .catch(error => console.error('Error logging out:', error));
        });
    }
});

document.getElementById("logoutNav").addEventListener("click", function (event) {
    event.preventDefault(); 
    fetch("/logout")
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "/login"; 
        })
        .catch(err => console.error("Logout error:", err));
});

        function filterCourses() {
            const selectedMajor = document.getElementById('majorSelect').value;
            const selectedSubMajor = document.getElementById('subMajorSelect').value;
            const selectedStatus = document.getElementById('statusSelect').value;
            const courseCards = document.querySelectorAll('.course-card');

        
            courseCards.forEach(card => {
    const isBooked = card.querySelector(".book-button")?.textContent === "Cancel";
    
    const majorMatch = card.getAttribute("data-major").trim().toLowerCase() === selectedMajor.trim().toLowerCase() || selectedMajor === "All";
const subMajorMatch = selectedSubMajor === "All" || 
                      card.getAttribute("data-sub-major").trim().toLowerCase() === selectedSubMajor.trim().toLowerCase();
                             (selectedStatus === "Booked" && isBooked) || 
        (selectedStatus === "Not Booked" && !isBooked);

    card.style.display = majorMatch && subMajorMatch && statusMatch ? "block" : "none";
});
           
        }
        
        document.addEventListener("DOMContentLoaded", function () {
    const majors = JSON.parse(document.getElementById("majorsData").textContent);
    const subMajors = {};  // ✅ Ensure subMajors object is populated

    majors.forEach(major => {
        subMajors[major.slug] = major.submajors.map(sub => sub.name); // ✅ Extract sub-major names
    });

    function updateSubMajorOptions() {
        const selectedMajor = document.getElementById("majorSelect").value;
        const subMajorSelect = document.getElementById("subMajorSelect");

        subMajorSelect.innerHTML = "<option value='All'>All</option>"; // ✅ Reset dropdown

        if (subMajors[selectedMajor]) {
            subMajors[selectedMajor].forEach(subMajor => {
                const option = document.createElement("option");
                option.value = subMajor;
                option.textContent = subMajor;
                subMajorSelect.appendChild(option);
            });
        }
        filterCourses(); // ✅ Trigger filtering after selection
    }

    document.getElementById("majorSelect").addEventListener("change", updateSubMajorOptions);
});
        
       function selectMajor(major) {
    const majorSelect = document.getElementById("majorSelect");
    majorSelect.value = major;

    const majorButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'majorDropdownContent\')"]');
    majorButton.textContent = major; 

    filterCourses(); 
}

       function selectSubMajor(subMajor) {
    document.getElementById("subMajorSelect").value = subMajor;
    const subMajorButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'dropdownContent\')"]');
    subMajorButton.textContent = subMajor; 
    
    filterCourses(); 
}
        
        function selectStatus(status) {
            const statusSelect = document.getElementById('statusSelect');
            statusSelect.value = status;
            const statusButton = document.querySelector('.dropbtn[onclick="toggleDropdown(\'statusDropdownContent\')"]');
            filterCourses();         }
               
        function bookSession(button, mentorship, date, time) {
            const isBooked = button.textContent === "Cancel";
            if (isBooked) {
                button.textContent = "Book Now";
                removeFromSchedule(mentorship, date, time);
            } else {
                alert(`You have booked ${mentorship} on ${date} at ${time}.`);
                button.textContent = "Cancel";
                addToSchedule(mentorship, date, time);
            }
            filterCourses(); 
        }

        function applyInternship(button, internship,duration) {
            const internshipDetails = `${internship}  - ${duration}`;
            const isApplied = button.textContent === "Cancel";
            if (isApplied) {
                button.textContent = "Apply Now";
            } else {
                alert(`You have applied to ${internship} for ${duration}.`);
                button.textContent = "Cancel";
            }
            filterCourses(); 
        }
        
        function addToSchedule(mentorship, date, time) {
            const month = new Date(date).toLocaleString('en-US', { month: 'long' }).toLowerCase();
            const day = new Date(date).toLocaleString('en-US', { weekday: 'long' });
            const sessionDiv = document.getElementById(`${day.toLowerCase()}-sessions`);
            const sessionEntry = document.createElement('div');
            sessionEntry.textContent = `${mentorship} - ${date} at ${time}`;
            sessionEntry.className = `session-entry ${month}`; 
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
        
        function toggleDropdown(dropdownId) {
            document.getElementById(dropdownId).classList.toggle("show");
        }
        
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

 function showAddMajorForm() {
            document.getElementById('addMajorForm').style.display = 'block';
        }

        function hideAddMajorForm() {
            document.getElementById('addMajorForm').style.display = 'none';
        }


async function addMajor(event) {
    event.preventDefault();

    const majorName = document.getElementById('majorName').value.trim();
    const majorSlug = document.getElementById('majorSlug').value.trim();
    const majorImg = document.getElementById('majorImg').files[0];
    const submajorBlocks = document.querySelectorAll('.submajor-block');

    if (!majorName || !majorSlug) {
        alert("Major name and slug are required!");
        return;
    }

    const formData = new FormData();
    formData.set('name', majorName);
    formData.set('slug', majorSlug);
    if (majorImg) {
        formData.set('img', majorImg);
    }

    submajorBlocks.forEach((block) => {
        block.querySelectorAll('input, textarea').forEach((field) => {
            if (field.type === 'file') {
                formData.append(field.name, field.files[0]);
            } else {
                formData.append(field.name, field.value);
            }
        });
    });

   try {
    const res = await fetch("/majors", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (!res.ok) {
        alert(`Error: ${data.error || "Unknown issue"}`);
        console.error("Server Response:", data);
        return;
    }

    alert("Major added!");
    location.reload();
} catch (err) {
    console.error("Fetch error:", err);
    alert("Something went wrong.");
}}