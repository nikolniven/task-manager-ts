import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

    authService
      .signup(requestBody)
      .then((response: { data: any }) => {
        console.log('Signup successful:', response.data);
        navigate('/login');
      })
      .catch((error: { response: { data: { message: string } } }) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription: string = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmail}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
            />
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={handleName}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="John Doe"
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
