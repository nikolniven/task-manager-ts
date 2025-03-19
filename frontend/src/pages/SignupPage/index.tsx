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
    <div className="min-h-screen flex items-center justify-center bg-teal-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-teal-300">
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">
          Sign Up
        </h1>
        <div className="bg-red-500 text-white p-4">Tailwind Test</div>
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-teal-700"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmail}
              className="w-full px-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-teal-700"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="********"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-teal-700"
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={handleName}
              className="w-full px-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="John Doe"
            />
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-teal-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-700 hover:text-teal-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
