"""Write the public numbers of the Maho project to docs/assets/data/stats.json.

The numbers come from the GitHub API of MahoCommerce/maho. The hook hooks/stats.py puts them
into the pages at build time, and the Stats workflow runs this script every day.

A community issue is an issue that a person other than the maintainer and the bots opened, and
that GitHub shows as closed as completed. Its fix time is the time from the report to the close.
A bug is an issue with the Bug issue type or the bug label, which the bug report form sets.

Set GITHUB_TOKEN to a token that can read public repositories, and MAHO_SOURCE to a checkout of
the Maho repository (default: ../maho), where the script counts the automated tests.
"""

import glob
import json
import os
import re
import statistics
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

REPO_OWNER = "MahoCommerce"
REPO_NAME = "maho"
MAINTAINERS = {"fballiano", "mahobot"}
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "docs", "assets", "data", "stats.json")
API = "https://api.github.com"


def request(url, data=None):
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "mahocommerce.com stats",
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
    }
    body = json.dumps(data).encode() if data is not None else None
    with urllib.request.urlopen(urllib.request.Request(url, body, headers), timeout=60) as response:
        return json.load(response)


def graphql(query, variables):
    result = request(f"{API}/graphql", {"query": query, "variables": variables})
    if "errors" in result:
        sys.exit(f"GitHub GraphQL error: {result['errors']}")
    return result["data"]


def parse_date(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def all_issues():
    query = """
    query($owner: String!, $name: String!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        issues(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            state createdAt closedAt stateReason author { login }
            issueType { name } labels(first: 20) { nodes { name } }
          }
        }
      }
    }"""
    cursor = None
    while True:
        page = graphql(query, {"owner": REPO_OWNER, "name": REPO_NAME, "cursor": cursor})
        issues = page["repository"]["issues"]
        yield from issues["nodes"]
        if not issues["pageInfo"]["hasNextPage"]:
            return
        cursor = issues["pageInfo"]["endCursor"]


def is_bug(issue):
    return (issue["issueType"] or {}).get("name") == "Bug" or any(
        label["name"] == "bug" for label in issue["labels"]["nodes"]
    )


def fix_times(issues):
    hours = [(parse_date(i["closedAt"]) - parse_date(i["createdAt"])).total_seconds() / 3600 for i in issues]
    if not hours:
        return None

    def share(limit):
        return round(100 * sum(h <= limit for h in hours) / len(hours))

    return {
        "count": len(hours),
        "median_hours": round(statistics.median(hours), 1),
        "within_24h": share(24),
        "within_48h": share(48),
        "within_7d": share(24 * 7),
    }


def releases():
    result = []
    page = 1
    while True:
        batch = request(f"{API}/repos/{REPO_OWNER}/{REPO_NAME}/releases?per_page=100&page={page}")
        result += [r for r in batch if not r["draft"] and re.fullmatch(r"\d+\.\d+\.\d+", r["tag_name"])]
        if len(batch) < 100:
            return result
        page += 1


def headline_features(body):
    """Count the ### headings in the "New features" section of a release note."""
    section = re.search(r"^## [^\n]*New features[^\n]*$(.*?)(?=^## |\Z)", body or "", re.M | re.S)
    return len(re.findall(r"^### ", section.group(1), re.M)) if section else 0


def merged_pull_requests(since=None, until=None):
    query = f"repo:{REPO_OWNER}/{REPO_NAME} is:pr is:merged base:main"
    if since and until:
        query += f" merged:{since}..{until}"
    url = f"{API}/search/issues?per_page=1&q={urllib.request.quote(query)}"
    return request(url)["total_count"]


def vulnerabilities(severity):
    """Read the badge that the daily scan of the SBOMs writes in MahoCommerce/sboms."""
    url = f"https://raw.githubusercontent.com/{REPO_OWNER}/sboms/main/badges/{severity}.json"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "mahocommerce.com stats"}), timeout=60) as response:
        return int(json.load(response)["message"])


def automated_tests():
    """Count the test() and it() cases of the Pest suites."""
    source = os.environ.get("MAHO_SOURCE", os.path.join(os.path.dirname(__file__), "..", "..", "maho"))
    files = glob.glob(os.path.join(source, "tests", "**", "*.php"), recursive=True)
    if not files:
        sys.exit(f"No test files in {source}/tests: set MAHO_SOURCE to a Maho checkout.")
    case = re.compile(r"^\s*(?:test|it)\(", re.M)
    total = 0
    for path in files:
        with open(path, encoding="utf-8", errors="replace") as file:
            total += len(case.findall(file.read()))
    return total


def main():
    now = datetime.now(timezone.utc)
    issues = list(all_issues())
    community = [
        i for i in issues
        if i["state"] == "CLOSED" and i["stateReason"] == "COMPLETED"
        and i["author"] and i["author"]["login"] not in MAINTAINERS
    ]
    open_issues = [i for i in issues if i["state"] == "OPEN"]
    year_ago = now - timedelta(days=365)

    all_releases = sorted(releases(), key=lambda r: r["published_at"])
    feature_releases = [r for r in all_releases if r["tag_name"].endswith(".0")]
    patch_releases = [r for r in all_releases if not r["tag_name"].endswith(".0")]
    latest, previous = feature_releases[-1], feature_releases[-2]

    stats = {
        "updated": now.strftime("%Y-%m-%d"),
        "issues": {
            "all_time": fix_times(community),
            "last_12_months": fix_times([i for i in community if parse_date(i["createdAt"]) >= year_ago]),
            "bugs": fix_times([i for i in community if is_bug(i)]),
        },
        "releases": {
            "feature": len(feature_releases),
            "patch": len(patch_releases),
            "first": feature_releases[0]["tag_name"],
            "latest": latest["tag_name"],
            "headline_features": sum(headline_features(r["body"]) for r in feature_releases),
        },
        "pull_requests": {
            "merged": merged_pull_requests(),
            "merged_latest_release": merged_pull_requests(previous["published_at"][:10], latest["published_at"][:10]),
        },
        "open_issues": len(open_issues),
        "open_bugs": sum(1 for i in open_issues if is_bug(i)),
        "vulnerabilities": {"critical": vulnerabilities("critical"), "high": vulnerabilities("high")},
        "tests": automated_tests(),
    }

    if os.path.exists(OUTPUT):
        with open(OUTPUT) as file:
            current = json.load(file)
        if {**current, "updated": None} == {**stats, "updated": None}:
            print("No number changed.")
            return

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w") as file:
        json.dump(stats, file, indent=2)
        file.write("\n")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
