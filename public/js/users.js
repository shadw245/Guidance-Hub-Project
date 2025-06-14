// public/js/users.js
function showAddUserForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userFormContainer').style.display = 'block';
}

function hideUserForm() {
    document.getElementById('userFormContainer').style.display = 'none';
}

function editUser(id) {
    fetch(`/users/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.user) {
                const user = data.user;
                document.getElementById('userId').value = user._id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userGender').value = user.gender;
                document.getElementById('userRole').value = user.isAdmin ? 'admin' : 'user';
                document.getElementById('userIsInstructor').value = user.isInstructor.toString();
                document.getElementById('modalTitle').textContent = 'Edit User';
                document.getElementById('userFormContainer').style.display = 'block';
            } else {
                alert(data.message || 'Error loading user');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading user details');
        });
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/users/${id}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert(data.message || 'Error deleting user');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting user');
        });
    }
}

document.getElementById('userForm').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('userId').value;
    const data = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        gender: document.getElementById('userGender').value,
        role: document.getElementById('userRole').value,
        isInstructor: document.getElementById('userIsInstructor').value === 'true'
    };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/users/${id}` : '/users';
    
    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            throw new Error(data.message || 'Failed to save user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Error saving user. Please try again.');
    });
};
