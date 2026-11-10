"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function PlayerFrame({ src, title, thumbnail }: { src: string; title: string; thumbnail: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);

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
    <iframe ref={frame} src={src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="origin" onFocus={() => setStarted(true)} />
    {!started && <div className="player-poster" aria-hidden="true">
      <Image src={thumbnail} alt="" fill sizes="(max-width: 780px) 100vw, 70vw" unoptimized priority />
      <span className="player-poster-shade" />
      <span className="player-poster-play">▶</span>
    </div>}
  </div>;
}
