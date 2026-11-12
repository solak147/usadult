"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function PlayerFrame({
  src,
  title,
  thumbnail,
  fallbackThumbnail,
}: {
  src: string;
  title: string;
  thumbnail: string;
  fallbackThumbnail?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(thumbnail);

  useEffect(() => {
    setCurrentPoster(thumbnail);
  }, [thumbnail]);

  useEffect(() => {
    const checkFocus = () => {
      if (document.activeElement === frame.current) setStarted(true);
    };
    document.addEventListener("focusin", checkFocus);
    const interval = window.setInterval(checkFocus, 150);
    return () => {
      document.removeEventListener("focusin", checkFocus);
      window.clearInterval(interval);
    };
  }, []);

  return <div className="player-frame">
    <iframe ref={frame} src={src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="origin" onFocus={() => setStarted(true)} loading="lazy" />
    {!started && <div className="player-poster" aria-hidden="true">
      <Image
        src={currentPoster}
        alt=""
        fill
        sizes="(max-width: 780px) 100vw, 70vw"
        unoptimized
        priority
        onError={() => {
          if (fallbackThumbnail && currentPoster !== fallbackThumbnail) {
            setCurrentPoster(fallbackThumbnail);
          }
        }}
      />
      <span className="player-poster-shade" />
      <span className="player-poster-play">▶</span>
    </div>}
  </div>;
}
