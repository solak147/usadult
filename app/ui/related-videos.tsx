import Image from "next/image";
import Link from "next/link";
import { formatViews, type Video } from "@/lib/adult-embed";

function publishedLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

export default function RelatedVideos({ videos }: { videos: Video[] }) {
  if (!videos.length) return <p className="related-empty">No related videos available.</p>;
  return <div className="related-scroll" role="region" tabIndex={0} aria-label="Scrollable related videos">
    {videos.map(video => <Link className="related-card" href={`/video/${video.id}`} key={video.id}>
      <span className="related-thumb"><Image src={video.thumbnail} alt={video.title} fill sizes="(max-width: 700px) 42vw, 156px" unoptimized /><span>{video.duration || "Video"}</span></span>
      <span className="related-copy"><strong>{video.title}</strong><small>{video.performers?.[0]?.name || video.studio?.name || "Related scene"}</small><small>{formatViews(video.view_count)} views{publishedLabel(video.published_at) ? ` · ${publishedLabel(video.published_at)}` : ""}</small></span>
    </Link>)}
  </div>;
}
