import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard")
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-gray-700 text-center mb-12">Sign in to continue</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                    type="submit"
                    className="w-full bg-gray-200 py-2 rounded-lg transition duration-200 font-bold"
                >
                    Login
                </button>
                <p className="mt-8">
                    Don't have an account? <Link to="/register" className="font-bold mx-2 text-blue-500">Register here</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
