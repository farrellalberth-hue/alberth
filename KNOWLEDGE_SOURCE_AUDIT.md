# Kentzo Knowledge Atlas — Source Coverage and Exclusion Audit

**Audit date:** 2026-10-14 · **Source:** nine original Google Drive ZIP study notes (CRYPTO_13, 17, 25, 27, 33, 39, 52, 55, and INVEST_56).

## What was verified

- All nine ZIP files were available and their `.txt` contents were inspected.
- The dated source notes span a date explicitly recorded as **29 March 2024** through **22 August 2026**. The first archive lists **28 April 2024**, then **29 March 2024**, then **30 April 2024**; this chronology anomaly is in the **original source**. We preserve the literal date instead of silently guessing a correction.
- The first archive also contains **3, 4 and 5 May 2024 dates with the word LIST** after the date. These were not parsed correctly previously; entries were restored or moved to the appropriate recorded day.
- Another archive has a **26 March 2025.** heading with a trailing period; review dates have been corrected where verified, including Laubach–Williams and Treynor/Beta reviews.
- Explicit **(Review)** study topics are retained with separate REVIEW badges and study dates.
- Several YouTube-style content records escaped the initial filters due to unfamiliar channel prefixes; **3Blue1Brown**, **Sucor Sekuritas**, and their video titles were removed. A video-style **Diary Rintisan by Finfolk** entry was removed from the review source index. The retained `Bloomberg Barclays Global Aggregate Bond Index` is a **financial benchmark**, not a channel.
- Media/channel filtering was checked against creator/channel identifiers found in the ZIPs, not just the literal words “YouTube” and “video.”
- The default archive entries are separated into individual topic cards and review occurrences remain dated. All topic names in the published index avoid the ampersand (`&`) separator.

## Source record accounting

A conservative scan of the dated notes produced **828 recognizable daily headings**, approximately **3,721 nonempty data lines**, and **609 likely media mentions** flagged heuristically, leaving approximately **3,112 candidate source lines**. These are **not a unique topic count**. Some single note lines contain dozens of subjects; other lines repeat prior reviews, contain errands, or reference videos. Filter heuristics can under- or over-count. The counts are for auditing only.

### Coverage boundary

**Do not claim that every one of the source's study topics has been exhaustively included.** The index previously relied on classification heuristics and English normalization, and source material is messy (mixed Indonesian and English, nested brackets, dated reviews, video titles). This pass recovered confirmed missing early entries, repaired heading issues and removed confirmed media entries. Further line-by-line editorial reconciliation would be necessary to certify 100% coverage.

## Preservation rules

1. Do not include creator channels, podcasts, videos, or video titles as learning topics.
2. Preserve explicit Review entries with `REVIEW` on the topic and original date.
3. Keep every topic as a standalone card (no joined `&` lists).
4. Do not change the separate original Alberth `main` branch.
5. Treat any ambiguous source date/title as uncertain rather than guessing.

## Current totals

- **3,153** indexed dated topic cards (including review entries).
- **2,001** review-marked individual cards.
- Economics: 787; Finance: 677; Crypto: 231; Others: 1458.
- Years: 2024 718; 2025 1095; 2026 1340.
