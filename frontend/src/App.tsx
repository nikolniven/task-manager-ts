import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage, SignupPage, LoginPage } from './pages';
import { Navbar } from './components/Navbar';
import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/home"
          element={
            <IsPrivate>
              <HomePage />
            </IsPrivate>
          }
        />
        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
      </Routes>
    </>
  );
}

export default App;
