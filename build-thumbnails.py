"""Build AFH YouTube preview assets into GitHub Pages _site.
Fetch only public thumbnail imagery for IDs already present in the verified user
archive. Store copies as local static assets to avoid third-party browser hotlink
failures. Never modify the source JSON or access private YouTube data.

Stdlib only; output is part of the free GitHub Pages deploy artifact, NOT
committed into the repository. Validates JPEG dimensions so YouTube's tiny
placeholder JPEG does not get promoted to a real thumbnail.
"""
from __future__ import annotations

import concurrent.futures
import json
import os
from pathlib import Path
import urllib.request
import urllib.error

BASE = Path(__file__).resolve().parent
SITE = BASE / "_site"
TARGET = SITE / "video-thumbs"
ARCHIVE = BASE / "youtube-library.json"
LIMIT = 661
WORKERS = 18
TIMEOUT = 7
MAX_BYTES = 850_000
MIN_WIDTH = 640
MIN_HEIGHT = 360
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; AFH-Personal-Portfolio/1.0)",
    "Accept": "image/avif,image/webp,image/jpeg,image/*;q=0.8",
}


def jpeg_dimensions(data: bytes) -> tuple[int, int] | None:
    if len(data) < 4000 or data[:2] != b"\xff\xd8":
        return None
    pos = 2
    while pos + 9 < len(data):
        if data[pos] != 0xFF:
            pos += 1
            continue
        marker = data[pos + 1]
        pos += 2
        if marker in (0xD8, 0xD9, 0x01):
            continue
        if marker == 0xDA:
            break
        if pos + 2 > len(data):
            break
        length = int.from_bytes(data[pos:pos + 2], "big")
        if length < 2 or pos + length > len(data):
            break
        if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                      0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
            height = int.from_bytes(data[pos + 3:pos + 5], "big")
            width = int.from_bytes(data[pos + 5:pos + 7], "big")
            return width, height
        pos += length
    return None


def fetch_image(video_id: str) -> dict:
    base_url = "https://i.ytimg.com/vi/" + video_id + "/"
    for kind in ("maxresdefault.jpg", "sddefault.jpg", "hq720.jpg"):
        try:
            url = base_url + kind
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                if resp.status != 200:
                    continue
                data = resp.read(MAX_BYTES + 1)
            if len(data) > MAX_BYTES:
                continue
            size = jpeg_dimensions(data)
            if not size or size[0] < MIN_WIDTH or size[1] < MIN_HEIGHT:
                continue
            # Keep filename derived solely from verified YouTube ID.
            (TARGET / (video_id + ".jpg")).write_bytes(data)
            return {"id": video_id, "status": "cached", "width": size[0],
                    "height": size[1], "bytes": len(data)}
        except (urllib.error.URLError, OSError, TimeoutError, ValueError):
            continue
    return {"id": video_id, "status": "unavailable"}


def main() -> None:
    data = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    entries = [
        e for e in data.get("videos", [])
        if isinstance(e.get("id"), str) and len(e["id"]) == 11
           and all(c.isalnum() or c in "_-" for c in e["id"])
    ]
    entries.sort(key=lambda v: v.get("date", ""), reverse=True)
    seen: set[str] = set()
    ids: list[str] = []
    for entry in entries:
        if entry["id"] not in seen:
            ids.append(entry["id"])
            seen.add(entry["id"])
        if len(ids) >= LIMIT:
            break
    TARGET.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=WORKERS) as pool:
        results = list(pool.map(fetch_image, ids))
    cached = [r for r in results if r["status"] == "cached"]
    report = {
        "source": "Verified Google Takeout YouTube archive",
        "attempted": len(ids),
        "cached": len(cached),
        "unavailable": len(ids) - len(cached),
        "cached_ids": [r["id"] for r in cached],
    }
    (SITE / "video-thumbnails-manifest.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("AFH THUMBNAIL REPORT", json.dumps(
        {k: v for k, v in report.items() if k != "cached_ids"}))
    for item in results[:6]:
        print("AFH THUMBNAIL SAMPLE", json.dumps(item))
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as handle:
            handle.write(
                f"\n### Verified YouTube video previews\n"
                f"{len(cached)} of {len(ids)} images saved as local site assets. "
                f"Unavailable videos retain title-specific readable fallback.\n"
            )


if __name__ == "__main__":
    main()
