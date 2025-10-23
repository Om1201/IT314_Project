import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Home from './components/Home';
import Signup from './components/Signup';
import VerifyAccount from './components/VerifyAccount';
import Callback from './components/Callback';
import ResetPassword from './components/ResetPassword';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/userSlicer';

import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
    <Toaster reverseOrder={false}/>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/signin' element={<Signin/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/verifyaccount' element={<VerifyAccount/>} />
          <Route path='/paswordReset' element={<ResetPassword/>} />
          <Route path='/oauth/google/callback' element={<Callback/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
