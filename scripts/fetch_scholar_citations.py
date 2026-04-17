#!/usr/bin/env python3
"""
Fetch citation counts from Google Scholar and write src/citations.json.
Requires: pip install scholarly

Run from project root: python scripts/fetch_scholar_citations.py
"""

import json
import os
import time

# Publications to look up (must match src/data.ts). Key = doi if present, else title (used in citations.json).
PUBLICATIONS = [
    {"title": "Generative AI for Synthetic Data Across Multiple Medical Modalities: A Systematic Review of Recent Developments and Challenges", "doi": "10.1016/j.compbiomed.2025.109834"},
    {"title": "A New PCA-based Utility Measure for Synthetic Data Evaluation", "doi": None},
    {"title": "A Multi-Dimensional Evaluation of Synthetic Data Generators", "doi": "10.1109/ACCESS.2022.3144765"},
    {"title": "Fake It Till You Make It: Guidelines for Effective Synthetic Data Generation", "doi": "10.3390/app11052158"},
]


def main():
    try:
        from scholarly import scholarly
    except ImportError:
        print("Install scholarly: pip install scholarly")
        raise SystemExit(1)

    citations = {}
    for i, pub in enumerate(PUBLICATIONS):
        title = pub["title"]
        key = pub["doi"] if pub["doi"] else title
        print(f"[{i+1}/{len(PUBLICATIONS)}] Searching: {title[:60]}...")
        try:
            search = scholarly.search_pubs(title)
            result = next(search, None)
            if result is None:
                print(f"  -> No result")
                continue
            scholarly.fill(result)
            count = result.get("num_citations", 0) or 0
            citations[key] = count
            print(f"  -> {count} citations")
        except Exception as e:
            print(f"  -> Error: {e}")
        time.sleep(2)  # be nice to Google

    out_path = os.path.join(os.path.dirname(__file__), "..", "src", "citations.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(citations, f, indent=2)
    print(f"\nWrote {len(citations)} citation counts to src/citations.json")


if __name__ == "__main__":
    main()
