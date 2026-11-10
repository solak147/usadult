"use client";

import { useEffect, useRef, useState } from "react";

type Props = { slug: string; episode: number; poster?: string };
type Stream = { url: string; headers?: Record<string, string> };
type StreamResponse = { streams?: Stream[]; subtitles?: { url: string; language?: string; label?: string; headers?: Record<string, string> }[] };

function proxiedUrl(url: string, headers: Record<string, string> = {}) {
  const query = new URLSearchParams({ url });
  const referrer = headers.Referer || headers.referer;
  const userAgent = headers["User-Agent"] || headers["user-agent"];
  if (referrer) query.set("ref", referrer);
  if (userAgent) query.set("ua", userAgent);
  return `/api/hls?${query.toString()}`;
}

export default function AdultAnimePlayer({ slug, episode, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("Loading episode…");
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStreamData(null);
    setMessage("Loading episode…");
    fetch(`https://haven.reyamika.eu.cc/api/anime/${encodeURIComponent(slug)}/episodes/${episode}/stream`, { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("The episode stream is unavailable.");
        return response.json() as Promise<StreamResponse>;
      })
      .then(data => {
        if (cancelled) return;
        const stream = data.streams?.find(item => item.url);
        if (!stream) throw new Error("No playable stream was returned.");
        setStreamData(data);
        setMessage("");
      })
      .catch(error => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Could not load this episode."); });
    return () => { cancelled = true; };
  }, [slug, episode]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamData?.streams?.find(item => item.url);
    if (!video || !stream) return;
    let disposed = false;
    let hls: { destroy: () => void } | undefined;
    const source = proxiedUrl(stream.url, stream.headers);

    const attach = async () => {
      const module = await import("hls.js");
      const Hls = module.default;
      if (disposed) return;
      if (Hls.isSupported()) {
        const player = new Hls({ enableWorker: true });
        hls = player;
        player.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal && !disposed) setMessage(`Playback failed (${data.details}).`);
        });
        player.loadSource(source);
        player.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        setMessage("This browser does not support HLS playback.");
      }
    };
    void attach().catch(() => setMessage("Could not start the video player."));
    return () => {
      disposed = true;
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [streamData]);

  const subtitles = streamData?.subtitles || [];
  return <div className="anime-player">
    <video ref={videoRef} controls playsInline preload="metadata" poster={poster}>
      {subtitles.map((track, index) => <track key={`${track.url}-${index}`} kind="subtitles" src={proxiedUrl(track.url, track.headers)} srcLang={track.language || "en"} label={track.label || track.language || "Subtitles"} default={index === 0} />)}
    </video>
    {message && <p role="status">{message}</p>}
  </div>;
}
