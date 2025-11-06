import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChatBox from '../components/ChatBox';

export default function ChatPage() {
    const { roadmapId, chapterId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // If required params are missing, redirect
        if (!roadmapId || !chapterId) {
            navigate('/roadmaps');
        }
    }, [roadmapId, chapterId, navigate]);

    if (!roadmapId || !chapterId) {
        return null;
    }

    const handleClose = () => {
        // Navigate back to the roadmap page
        navigate(`/roadmap/${roadmapId}`);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden">
            <ChatBox
                roadmapId={roadmapId}
                chapterId={chapterId}
                onClose={handleClose}
                isFullscreen={true}
            />
        </div>
    );
}

