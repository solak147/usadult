import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STREAM_HOSTS = ["octopusmanifest.org", "yakijmons.top", "analizcv.top"];
const PLAYER_HOSTS = new Set(["hentaihaven.com", "www.hentaihaven.com"]);

function validStreamHost(value: URL) {
  return value.protocol === "https:" && STREAM_HOSTS.some(host => value.hostname === host || value.hostname.endsWith(`.${host}`));
}

function validPlayerHost(value: URL) {
  return value.protocol === "https:" && PLAYER_HOSTS.has(value.hostname);
}

function proxyUrl(source: URL, referrer: string, userAgent: string) {
  const query = new URLSearchParams({ url: source.toString(), ref: referrer, ua: userAgent });
  return `/api/hls?${query.toString()}`;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawUrl = params.get("url");
  const referrer = params.get("ref") || "";
  const userAgent = params.get("ua") || "";
  if (!rawUrl || referrer.length > 8192 || userAgent.length > 512 || !userAgent.startsWith("Mozilla/")) {
    return new Response("Invalid stream request", { status: 400 });
  }

  let source: URL;
  let ref: URL;
  try {
    source = new URL(rawUrl);
    ref = new URL(referrer);
  } catch {
    return new Response("Invalid stream URL", { status: 400 });
  }
  if (!validStreamHost(source) || !validPlayerHost(ref)) {
    return new Response("Stream host is not allowed", { status: 403 });
  }

  try {
    const headers = new Headers({
      "User-Agent": userAgent,
      Referer: ref.toString(),
      Origin: "https://hentaihaven.com",
    });
    const range = request.headers.get("range");
    if (range) headers.set("Range", range);
    const upstream = await fetch(source, { headers, cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(30000) });
    const finalUrl = new URL(upstream.url || source.toString());
    if (!validStreamHost(finalUrl)) return new Response("Unexpected stream redirect", { status: 502 });
    if (!upstream.ok) return new Response("Stream provider returned an error", { status: upstream.status });

    let contentType = upstream.headers.get("content-type") || "application/octet-stream";
    // Some CDN nodes incorrectly label MP4 initialization/media fragments as
    // Apple HLS playlists. Only playlist paths should be decoded and rewritten.
    const isPlaylist = /\.m3u8$/i.test(finalUrl.pathname);
    if (!isPlaylist && /mpegurl/i.test(contentType)) {
      if (/\.vtt$/i.test(finalUrl.pathname)) contentType = "text/vtt; charset=utf-8";
      else if (/\.(?:mp4|jpg|html)$/i.test(finalUrl.pathname)) contentType = "video/mp4";
      else contentType = "application/octet-stream";
    }
    if (isPlaylist) {
      const playlist = await upstream.text();
      const rewrite = (uri: string) => {
        try {
          const absolute = new URL(uri, finalUrl);
          if (!validStreamHost(absolute)) return uri;
          return proxyUrl(absolute, ref.toString(), userAgent);
        } catch {
          return uri;
        }
      };
      const rewritten = playlist
        .split(/\r?\n/)
        .map(line => {
          if (!line) return line;
          if (line.startsWith("#EXT-X-MEDIA:") && /TYPE=SUBTITLES/.test(line)) return "";
          if (line.startsWith("#EXT-X-STREAM-INF:")) return line.replace(/,SUBTITLES="[^"]*"/g, "");
          if (line.startsWith("#")) return line.replace(/URI="([^"]+)"/g, (_, uri: string) => `URI="${rewrite(uri)}"`);
          return rewrite(line.trim());
        })
        .join("\n");
      return new Response(rewritten, { headers: { "Content-Type": "application/vnd.apple.mpegurl", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } });
    }

    const responseHeaders = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    });
    for (const name of ["content-length", "content-range", "accept-ranges"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return new Response("Unable to load stream", { status: 502 });
  }
}
