import YoutubeLogo from './ui/youtubeLogo';
const extractId = url => {
    try {
        const u = new URL(url);
        return u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
    } catch {
        return null;
    }
};

export default function YoutubeThumbnail({ url }) {
    const videoId = extractId(url);

    if (!videoId) {
        return (
            <div className="w-full aspect-video bg-red-100 text-red-600 grid place-content-center rounded-md text-sm">
                Invalid YouTube URL
            </div>
        );
    }

    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
        <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full aspect-video rounded-lg overflow-hidden group"
        >
            <img
                src={thumbnail}
                alt="YouTube Thumbnail"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Overlay Play Icon */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <YoutubeLogo />
            </div>
        </a>
    );
}
