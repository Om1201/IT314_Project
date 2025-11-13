export default function youtubeLogo() {
    return (
        <>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/95 rounded-full p-3 flex items-center justify-center shadow-md">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="red"
                        className="drop-shadow"
                    >
                        <path d="M23.5 6.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.7 2.5 12 2.5 12 2.5h0s-4.7 0-8.3.3c-.4 0-1.4.1-2.3 1C.7 4.6.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.7 0 8.3-.3c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.7 14.6V7.4l6.3 3.6-6.3 3.6z" />
                    </svg>
                </div>
            </div>
        </>
    );
}
