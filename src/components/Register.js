import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData }),
        });
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-gray-700 text-center mb-12">Create a new account</h2>
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
                    className="w-full bg-gray-200 font-bold py-2 rounded-lg transition duration-200"
                >
                    Register
                </button>
                <p className="mt-8">
                    Already have an account? <Link to="/login" className="font-bold mx-2 text-blue-500">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
