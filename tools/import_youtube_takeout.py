#!/usr/bin/env python3
"""Convert YouTube Takeout watch-history.json into categorized public archive data.
Runs locally with Python 3.10+ and standard library only.
Usage: python tools/import_youtube_takeout.py watch-history.json
Only publish exported output after reviewing private viewing activity.
"""
import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).resolve().parent.parent
SECTORS = {
    "AI": ("artificial intelligence", "ai agent", "chatgpt", "llm", "machine learning", "n8n", "ollama", "openclaw", "gemini", "openai", "claude", "automation", "coding", "python", "github", "model ai"),
    "Economics": ("economics", "ekonomi", "ekuilibrium", "supply", "demand", "penawaran", "permintaan", "macro", "micro", "inflasi", "moneter", "fiskal", "game theory", "oligopol", "kurva", "elastisitas", "gdp", "pdb"),
    "Finance": ("finance", "investing", "investasi", "portfolio", "portofolio", "saham", "stock", "asset pricing", "capm", "valuation", "dividend", "bond", "obligasi", "banking", "finansial", "trading"),
    "Crypto": ("crypto", "bitcoin", "ethereum", "blockchain", "solana", "altcoin", "defi", "token", "web3", "onchain", "wallet", "airdrop", "usdt", "btc", "eth"),
    "Mathematics": ("mathematics", "matematika", "calculus", "kalkulus", "statistika", "probability", "probabilitas", "algebra", "optimization", "linear programming", "regression"),
    "Business": ("bisnis", "business", "accounting", "akuntansi", "inventory", "manajemen", "erp", "sales", "pemasaran", "marketing", "operational", "entrepreneur", "usaha"),
}

def extract_id(url):
    if not url:
        return None
    u = urlparse(url)
    host = u.netloc.lower().removeprefix("www.")
    if host == "youtu.be":
        part = u.path.strip("/").split("/")[0]
    elif host in ("youtube.com", "m.youtube.com", "music.youtube.com"):
        part = parse_qs(u.query).get("v", [""])[0] if u.path == "/watch" else (u.path.strip("/").split("/")[1] if u.path.startswith(("/shorts/", "/live/")) and len(u.path.strip("/").split("/")) > 1 else "")
    else:
        return None
    return part if re.fullmatch(r"[\w-]{11}", part) else None

def classify(title, channel):
    text = (title + " " + channel).casefold()
    scores = {sector: sum(1 for kw in kws if kw in text) for sector, kws in SECTORS.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] else "Other"

def parse_date(s):
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00")).date().isoformat()
    except (ValueError, TypeError, AttributeError):
        return None

def from_json(path):
    raw = json.loads(path.read_text(encoding="utf-8-sig"))
    if isinstance(raw, dict):
        raw = raw.get("events", raw.get("videos", []))
    if not isinstance(raw, list):
        raise ValueError("Expected JSON Takeout watch-history list.")
    videos = []
    for row in raw:
        if not isinstance(row, dict):
            continue
        video_id = extract_id(row.get("titleUrl", row.get("url", "")))
        date = parse_date(row.get("time", row.get("date", "")))
        if not video_id or not date or date < "2025-01-01":
            continue
        title = re.sub(r"^Watched\s+", "", str(row.get("title", "")), flags=re.I).strip()
        if not title:
            continue
        subtitles = row.get("subtitles", []) or []
        channel = str(subtitles[0].get("name", "")) if subtitles and isinstance(subtitles[0], dict) else str(row.get("channel", ""))
        sector = classify(title, channel)
        videos.append({"id": video_id, "title": title, "channel": channel or "Unknown channel", "date": date, "sector": sector, "topic": sector + " viewing"})
    return videos

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("takeout", type=Path, help="Google Takeout YouTube watch-history.json")
    parser.add_argument("--output", type=Path, default=ROOT / "youtube-library.json")
    args = parser.parse_args()
    if args.takeout.suffix.lower() != ".json":
        parser.error("Use the watch-history.json export. HTML exports must be converted first.")
    new_videos = from_json(args.takeout)
    existing = {}
    if args.output.exists():
        for item in json.loads(args.output.read_text(encoding="utf-8")).get("videos", []):
            if extract_id("https://www.youtube.com/watch?v=" + str(item.get("id", ""))):
                existing[item["id"]] = item
    for item in new_videos:
        old = existing.get(item["id"])
        if old is None or item["date"] >= old.get("date", ""):
            existing[item["id"]] = item
    ordered = sorted(existing.values(), key=lambda v: (v["date"], v["id"]), reverse=True)
    output = {"source": "YouTube Google Takeout viewing export; categories heuristically classified and must be reviewed before publication", "lastUpdated": datetime.now(timezone.utc).date().isoformat(), "videos": ordered}
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(new_videos)} viewing events, {len(ordered)} unique videos; wrote {args.output}")
    print("Review the generated file for personal/sensitive entries and classification errors before publishing.")

if __name__ == "__main__":
    main()
