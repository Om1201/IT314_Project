import { useState, useEffect } from 'react';

export function useStopwatch() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const toggle = () => {
        setIsRunning(prev => !prev);
    };

    const reset = () => {
        setSeconds(0);
        setIsRunning(false);
    };

    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;

    return {
        minutes,
        seconds: displaySeconds,
        isRunning,
        toggle,
        reset,
    };
}
