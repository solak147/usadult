import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/adult-embed";
import { formatViews } from "@/lib/adult-embed";

export default function VideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  return <article className="video-card"><Link href={`/video/${video.id}`} className="card-link" aria-label={`Watch ${video.title}`}>
    <div className="thumb"><Image src={video.thumbnail} alt={video.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" priority={priority} unoptimized /><span className="duration">{video.duration || "New"}</span><span className="play-mark" aria-hidden="true">↗</span></div>
    <div className="card-copy"><h3>{video.title}</h3><div className="card-meta"><span>{video.studio?.name || video.performers?.[0]?.name || "Featured scene"}</span><span>{formatViews(video.view_count)} views</span></div></div>
  </Link></article>;
}
