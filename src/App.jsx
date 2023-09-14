import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Login, OTPVerification, Signup } from './features/Authentication';
import { EditInfo } from './features/Profile';
import DHero from './pages/DHero';
import DHeroSearch from './pages/DHeroSearch';
import DHeroSearchResult from './pages/DHeroSearchResult';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Services from './pages/Services';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/dhero' element={<DHero />} />
        <Route path='/services/dhero/:vehicle' element={<DHeroSearch />} />
        <Route path='/services/dhero/search' element={<DHeroSearchResult />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/otp-verification' element={<OTPVerification />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/profile/edit' element={<EditInfo />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
