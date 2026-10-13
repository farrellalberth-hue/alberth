"""Build a static preview of AFH without exposing repository metadata or build scripts.

Used by the no-cost Render static-site fallback. The existing Vercel project,
domain, GitHub workflow and source files are not modified by this builder.
"""
from pathlib import Path
import json
import os
import shutil

root = Path(__file__).resolve().parent
dest = root / "public"
excluded_dirs = {
    ".git", ".github", ".vercel", ".next", ".venv", "venv",
    "node_modules", "__pycache__", "public", "scripts", ".cache"
}
extensions = {
    ".html", ".htm", ".css", ".js", ".mjs", ".json", ".svg", ".png",
    ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico", ".webmanifest",
    ".woff", ".woff2", ".mp4", ".webm", ".xml", ".txt"
}
if dest.exists():
    shutil.rmtree(dest)
dest.mkdir(parents=True)
copied = 0
for src in root.rglob("*"):
    if not src.is_file():
        continue
    rel = src.relative_to(root)
    if any(part in excluded_dirs or part.startswith(".") for part in rel.parts):
        continue
    if src.suffix.lower() not in extensions:
        continue
    # Exclude non-site manifests and all private configuration, even if the repo is public.
    if src.name.lower() in {"package-lock.json", "package.json", "vercel.json"}:
        continue
    out = dest / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, out)
    copied += 1

for name in ("index.html", "atelier-noir-v19.css", "atelier-noir-v19.js",
             "knowledge-library-v18.js", "yellow-book/index.html",
             "yellow-book/atlas.js", "yellow-book/catalog.js",
             "yellow-book/notes.js", "yellow-book/atelier-v19.css"):
    assert (dest / name).is_file(), f"Required AFH static asset not found: {name}"
html = (dest / "index.html").read_text(encoding="utf-8")
assert 'class="hero afh19-hero"' in html
assert 'atelier-noir-v19.css' in html
assert "afh4-starfield" not in html
assert "afh3-orbit-system" not in html
(dest / "preview-build.json").write_text(json.dumps({
    "version": "Atelier Noir V19", "commit": os.environ.get("RENDER_GIT_COMMIT", ""),
    "provider": "Render Static Site"
}), encoding="utf-8")
print(f"AFH Atelier Noir V19 static build: {copied} public assets")
