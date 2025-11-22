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
import RoadmapDisplay from './pages/RoadmapDisplay';
import { Toaster } from 'react-hot-toast';
import Generator from './pages/Generator';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Roadmaps from './pages/Roadmaps';
import { fetchUserRoadmaps } from './features/roadmapSlicer';
import OnlineIDE from './pages/OnlineIDE';
import Search from './pages/Search.jsx';
import ChatPage from './pages/ChatPage.jsx';
import UserProfile from "./pages/UserProfile"
import ChangePassword from "./pages/ChangePassword"
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound.jsx';
import ResendVerifyLink from './pages/ResendVerifyLink.jsx';


function App() {
    const dispatch = useDispatch();
    const { authLoading } = useSelector(state => state.user);
    const { fetch_loading } = useSelector(state => state.roadmap);
    useEffect(() => {
        async function fetchData() {
            await dispatch(checkAuth());
            await dispatch(fetchUserRoadmaps());
        }
        fetchData();
    }, [dispatch]);

    if (authLoading && fetch_loading) {
        return <Loader />;
    }
    return (
        <>
            <Toaster reverseOrder={false} />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                     <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <GuestRoute>
                                <Signin />
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <GuestRoute>
                                <Signup />
                            </GuestRoute>
                        }
                    />
                    <Route path="/verifyaccount" element={<VerifyAccount />} />
                    <Route path="/passwordReset" element={<ResetPassword />} />
                    <Route path="/oauth/google/callback" element={<Callback provider='google' />} />
                    <Route path="/oauth/github/callback" element={<Callback provider='github' />} />
                    <Route
                        path="/roadmap/generate"
                        element={
                            <ProtectedRoute>
                                <Generator />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/roadmap/:id"
                        element={
                            <ProtectedRoute>
                                <RoadmapDisplay />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/roadmap/:roadmapId/chat/:chapterId"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/roadmaps"
                        element={
                            <ProtectedRoute>
                                <Roadmaps />
                            </ProtectedRoute>
                        }
                        />
                    <Route path="/ide/:id" element={
                        <ProtectedRoute>
                            <OnlineIDE />
                        </ProtectedRoute>
                        } />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resend-verify-link" element={<ResendVerifyLink />} />
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </Router>
        </>
    );
}

export default App;
