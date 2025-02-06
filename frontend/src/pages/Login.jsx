import React, { useState } from 'react'; //import react and other necessary components.
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import app from '../firebase';

const Login = () => {
    const [email, setEmail] = useState(''); //State variable for storing the email input.
    const [password, setPassword] = useState(''); //State variable for storing the password input.
    const [error, setError] = useState(''); //State variable for holding error messages.
    const navigate = useNavigate(); //useNavigate hook to navigate to different routes.
    const auth = getAuth(app); //Initialize firebase auth instance

    const handleLogin = async (e) => { //Asynchronous function to handle login when form is submitted.
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password); //Attempt to sign in the user with the provided email and password.
            navigate('/');
        } catch (error) {
            setError(error.message); // If error occurs during login, update the error state to display the error message.
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
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
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default Login;
