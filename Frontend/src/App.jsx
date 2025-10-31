import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';
import VerifyAccount from './pages/VerifyAccount';
import Callback from './components/Callback';
import ResetPassword from './pages/ResetPassword';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/userSlicer';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import RoadmapDisplay from "./pages/RoadmapDisplay";
import { Toaster } from 'react-hot-toast';
import Generator from './pages/Generator';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';

function App() {
    const dispatch = useDispatch();
    const { authLoading } = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (authLoading) {
        return <Loader />;
    }
    return (
        <>
            <Toaster reverseOrder={false}/>
            <Router>
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/signin' element={
                        <GuestRoute>
                            <Signin/>
                        </GuestRoute>
                    } />
                    <Route path='/signup' element={
                        <GuestRoute>
                            <Signup/>
                        </GuestRoute>
                    } />
                    <Route path='/verifyaccount' element={<VerifyAccount/>} />
                    <Route path='/passwordReset' element={<ResetPassword/>} />
                    <Route path='/oauth/google/callback' element={<Callback/>}/>
                    <Route path='/roadmap/generate' element={
                        <ProtectedRoute>
                            <Generator/>
                        </ProtectedRoute>
                    } />
                    <Route path='/roadmap/display' element={
                        <ProtectedRoute>
                            <RoadmapDisplay/>
                        </ProtectedRoute>
                    } />
                    <Route path='/loader' element={<Loader />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
