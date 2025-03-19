import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage, SignupPage, LoginPage } from './pages';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
