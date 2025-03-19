import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContextType, useAuthContext } from '../../context';
import { authService } from '../../services';

export function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useAuthContext() as AuthContextType;

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response: { data: { authToken: string } }) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate('/');
      })
      .catch((error: { response: { data: { message: string } } }) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="bg-teal-100 p-8 rounded-2xl shadow-lg w-full max-w-md border border-teal-300">
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">
          Login
        </h1>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
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

          {/* Error message */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-500 text-green font-semibold rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-teal-700 hover:text-teal-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
