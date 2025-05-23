import React, { useRef, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const watchedSetRef = useRef(new Set());
  const [watchPercent, setWatchPercent] = useState(0);
  const [videoKey, setVideoKey] = useState(0);

  const handleLoadedMetadata = () => {
    const prevStartTime = localStorage.getItem("start") || 0;
    const prevSet = new Set(JSON.parse(localStorage.getItem("watchSet")) || []);

    videoRef.current.currentTime = prevStartTime;
    watchedSetRef.current = prevSet;

    const videoDuration = Math.floor(videoRef.current.duration);
    setDuration(videoDuration);

    const newWatchedTime = watchedSetRef.current.size;
    setWatchedTime(newWatchedTime);

    const percent = (newWatchedTime / videoDuration) * 100;
    setWatchPercent(percent > 100 ? 100 : percent);
  };

  const handleTimeUpdate = () => {
    const currentSec = Math.floor(videoRef.current.currentTime);
    if (currentSec === 0) return;

    if (!watchedSetRef.current.has(currentSec)) {
      watchedSetRef.current.add(currentSec);
      const newWatchedTime = watchedSetRef.current.size;
      setWatchedTime(newWatchedTime);

      if (duration > 0) {
        const percent = (newWatchedTime / duration) * 100;
        setWatchPercent(percent > 100 ? 100 : percent);
      }
      localStorage.setItem(
        "watchSet",
        JSON.stringify(Array.from(watchedSetRef.current))
      );
    }
    localStorage.setItem("start", videoRef.current.currentTime);
  };

  function handleClear() {
    localStorage.removeItem("start");
    localStorage.removeItem("watchSet");
    watchedSetRef.current.clear();

    setDuration(0);
    setWatchedTime(0);
    setWatchPercent(0);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setVideoKey((prev) => prev + 1);
  }

  return (
    <div className="p-4 flex flex-row gap-10 justify-center m-4 rounded">
      <video
        key={videoKey}
        ref={videoRef}
        width="640"
        height="360"
        controls
        src="./sample-5s.mp4"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      >
        Sorry, your browser doesn't support videos.
      </video>

      <div className="flex flex-col gap-4">
        <div className="relative w-full h-2 bg-gray-200 rounded">
          <span
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{
              width: `${watchPercent}%`,
            }}
          ></span>
        </div>
        <p>Watched:- {watchPercent.toFixed(2)}%</p>

        <button
          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 pointer"
          onClick={handleClear}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
