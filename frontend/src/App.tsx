import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage, SignupPage } from './pages';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
