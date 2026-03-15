import React from "react";

const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => {
    if (!videoId || typeof videoId !== "string") {
        return <p>Invalid video ID</p>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
                src={embedUrl}
                title={title || "YouTube video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
};

export default YouTubeEmbed; 
