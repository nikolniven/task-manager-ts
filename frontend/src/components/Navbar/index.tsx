import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AuthContextType, useAuthContext } from '../../context';
import '../../index.css';

interface LinkType {
  to: string;
  title: string;
}

export const Navbar: React.FC = () => {
  const { isLoggedIn, user, logOutUser } = useAuthContext() as AuthContextType;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [dark, setDark] = useState(false);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme') === 'dark';
  //   setDark(savedTheme);
  //   document.documentElement.classList.toggle('dark', savedTheme);
  // }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const darkModeHandler = () => {
  //   setDark((prev) => {
  //     const newMode = !prev;
  //     localStorage.setItem('theme', newMode ? 'dark' : 'light');
  //     document.documentElement.classList.toggle('dark', newMode);
  //     return newMode;
  //   });
  // };

  const userLinks: LinkType[] = [
    { to: '/', title: 'Home' },
    { to: '/profile', title: 'Profile' },
    // { to: '/entries', title: 'My Entries' },
    // { to: '/reflection', title: 'Reflection Log' },
  ];

  const guestLinks: LinkType[] = [
    { to: '/', title: 'Home' },
    { to: '/login', title: 'Login' },
    { to: '/signup', title: 'Sign Up' },
  ];

  const activeLinks = isLoggedIn ? userLinks : guestLinks;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 pr-10 dark:text-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6 py-7">
        <button
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:block md:w-auto ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 dark:bg-gray-800 dark:border-gray-700">
            {activeLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block py-2 px-3 text-indigo-700 md:p-0 dark:text-indigo-500"
                >
                  {link.title}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <button
                  onClick={logOutUser}
                  className="py-2 px-3 text-indigo-700 dark:text-indigo-500 w-full"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
        {user && !isMenuOpen && (
          <p className="text-2xl font-semibold text-purple-700 md:text-right">
            Welcome back, {user.name} ✨
          </p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
