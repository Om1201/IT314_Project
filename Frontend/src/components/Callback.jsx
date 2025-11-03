import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { googleAuth } from '../features/userSlicer';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { fetchUserRoadmaps } from '../features/roadmapSlicer';

const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    useEffect(() => {
        const exchangeCode = async () => {
            try {
                const res = await dispatch(googleAuth(code));
                toast.success('Logged in successfully!');
                await dispatch(fetchUserRoadmaps());
                
                navigate('/'); // redirect after success
            } catch (err) {
                console.error('Error during token exchange:', err);
                alert(err.response?.data?.message || 'Failed to exchange code');
                navigate('/signin');
            }
        };

        if (error) {
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }

        if (code) {
            exchangeCode();
        }
    }, [code, error, navigate]);

    if (error) return <h2>Permission denied from your end. Redirecting…</h2>;
    if (code) return <Loader />;
    return <h2>Invalid request. Redirecting…</h2>;
};

export default Callback;
