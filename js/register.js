document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate saving the user data (e.g., to a backend server)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert('User already exists. Please login.');
        window.location.href = 'login.html';
    } else {
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    }
});
