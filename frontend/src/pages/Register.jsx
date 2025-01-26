import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import app from '../firebase';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                    Register
                </button>
            </form>
            <p className="mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default Register;