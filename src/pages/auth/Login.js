import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setCookie }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
        credentials: 'include',
        redirect: 'follow', // Ensure redirects are followed
      });

      if (response.ok) {
        console.log('Response OK');
        const cookies = document.cookie.split(';').reduce((res, c) => {
          const [key, val] = c.trim().split('=').map(decodeURIComponent);
          try {
            return Object.assign(res, { [key]: JSON.parse(val) });
          } catch (e) {
            return Object.assign(res, { [key]: val });
          }
        }, {});

        console.log('JSESSIONID:', cookies.JSESSIONID);

        setCookie(cookies.JSESSIONID);
        alert('Login successful');

        const userResponse = await fetch('/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.id;
          const userRole = userData.roles[0];

          if (userRole === 'ROLE_TRAINEE') {
            navigate(`/trainee/${userId}/dashboard`);
          } else if (userRole === 'ROLE_TRAINER') {
            navigate(`/trainer/${userId}/dashboard`);
          }else if(userRole === 'ROLE_ADMIN'){
            navigate(`/trainee/${userId}/dashboard`);
          }
        } else {
          console.log('Failed to fetch user data', userResponse.status, userResponse.statusText);
          alert('Failed to fetch user data');
        }
      } else {
        console.log('Login failed', response.status, response.statusText);
        alert('Wrong credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
