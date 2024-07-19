"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoPlayBack, IoPlayCircleSharp, IoPlayForward } from "react-icons/io5";

const VideoPlayer = () => {
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const savedTime = localStorage.getItem("playedSeconds");
    if (playerRef.current && savedTime) {
      playerRef.current.currentTime = parseFloat(savedTime);
    }
  }, []);

  const handleProgress = () => {
    if (playerRef.current) {
      const current = playerRef.current.currentTime;
      const total = playerRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      const progress = (current / total) * 100;
      setProgress(progress);
      localStorage.setItem("playedSeconds", current);
    }
  };

  const handleVideo = (action) => {
    if (playerRef.current) {
      switch (action) {
        case "rewind":
          playerRef.current.currentTime = Math.max(
            playerRef.current.currentTime - 10,
            0
          );
          break;
        case "play":
          if (playerRef.current.paused) {
            playerRef.current.play();
          } else {
            playerRef.current.pause();
          }
          break;
        case "forward":
          playerRef.current.currentTime = Math.min(
            playerRef.current.currentTime + 10,
            playerRef.current.duration
          );
          break;
        default:
          break;
      }
    }
  };

  const handleProgressBarClick = (event) => {
    if (progressBarRef.current && playerRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickRatio = clickX / rect.width;
      playerRef.current.currentTime = clickRatio * playerRef.current.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <main className="bg-blue-100 flex items-center h-screen w-screen justify-center">
      <div className="bg-white overflow-hidden w-11/12 rounded-lg h-4/5">
        {/* video */}
        <video
          ref={playerRef}
          className="h-[85%]"
          onTimeUpdate={handleProgress}
          onLoadedMetadata={handleProgress} // Set initial duration
          controlsList="nodownload"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* progress bar */}
        <div
          ref={progressBarRef}
          className="relative bg-gray-200 h-2 cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div
            className="absolute after:size-4 after:rounded-full after:block after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-2 after:bg-orange-500 top-0 left-0 h-full bg-orange-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex py-3 flex-shrink-0 h-[15%] items-center justify-center bg-gray-100 border gap-4">
          <div className="text-gray-700">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div
            onClick={() => handleVideo("rewind")}
            className="text-orange-400 hover:text-orange-600 cursor-pointer"
          >
            <IoPlayBack size={45} />
          </div>
          <div
            onClick={() => handleVideo("play")}
            className="text-orange-400 hover:text-orange-600 cursor-pointer"
          >
            <IoPlayCircleSharp size={45} />
          </div>
          <div
            onClick={() => handleVideo("forward")}
            className="text-orange-400 hover:text-orange-600 cursor-pointer"
          >
            <IoPlayForward size={45} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPlayer;
