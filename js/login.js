// // login.js

// import { login } from './api.js';

// document.addEventListener('DOMContentLoaded', function() {
//     const loginForm = document.getElementById('loginForm');
//     loginForm.addEventListener('submit', handleLogin);
// });

// async function handleLogin(event) {
//     event.preventDefault();
    
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     try {
//         const success = await login(username, password);
//         if (success) {
//             const urlParams = new URLSearchParams(window.location.search);
//             const redirectPage = urlParams.get('redirect') || 'index.html';
//             window.location.href = redirectPage;
//         } else {
//             alert('Invalid username or password. Please try again.');
//         }
//     } catch (error) {
//         console.error('Login failed:', error);
//         alert('Login failed. Please try again.');
//     }
// }

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate user authentication (e.g., with a backend server)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Login successful!');
        window.location.href = './index.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
});
