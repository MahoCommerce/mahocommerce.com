# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation website for Maho, an open-source on-premises e-commerce platform.
The website is built using MkDocs with the Material theme and hosted at https://mahocommerce.com.

## Development Commands

### Local Development
```bash
# Using Docker (recommended)
./start.sh

# Or manually with Docker
docker run --rm -it -p 8000:8000 -v .:/docs squidfunk/mkdocs-material

# Or with Python environment
pip install -r requirements.txt
mkdocs serve
```

The site will be available at http://localhost:8000

### Checking your changes (AI agents included)

If you need to build or preview the site to verify a change, do NOT run `mkdocs build` or
`mkdocs serve` directly - it requires local Python dependencies and `mkdocs build` leaves a
stray `site/` directory in the working tree. Instead, use Docker (via OrbStack on macOS) and
run:

```bash
./start.sh
```

This builds the local Docker image and serves the site with livereload at http://localhost:8000,
where you can check pages, navigation, and rendering. Production builds are handled by CI on push.

## Key Architecture

### Configuration
- **mkdocs.yml**: Main configuration file containing site structure, theme settings, and plugin configurations
- **requirements.txt**: Python dependencies for MkDocs and plugins
- **docs/maho.css**: Custom CSS styling for the Maho brand

### Documentation Structure
- **docs/**: Main documentation content
  - **blog/**: Release announcements and updates
  - **about/**, **community/**: Pages about the project
  - **assets/**: Images, logos, and static assets
  - **overrides/**: Custom MkDocs theme overrides
- The user guide, the developer docs, the API docs and the hosting docs (`user-guide/`,
  `developer/`, `api/` and `hosting/`) live in the Maho repository, next to the code. The hook
  `hooks/maho_docs.py` adds them at build time, from the `main` branch of Maho. Change these
  pages, their images and their menu (the `.nav.yml` files) in a Maho pull request.
- To preview a change in a local Maho checkout, run `MAHO_DOCS_SOURCE=../maho ./start.sh`.

### Content Guidelines
- Documentation is written in Markdown
- **Never use em-dashes (—)** in documentation or any other files. Use a hyphen with surrounding spaces ( - ), commas, or parentheses instead, whichever reads best in context.
- Blog posts follow the format: `YYYY-MM-DD-title.md` in `docs/blog/posts/`
- API documentation is organized by service type (REST/SOAP)
- Code examples should use appropriate syntax highlighting
- **Version Badges**: For features introduced in specific Maho versions, add a version badge to the page title:
  ```markdown
  # Feature Name <span class="version-badge">v25.x+</span>
  ```
  The version badge is styled in `docs/maho.css` and appears as an inline badge next to the heading

## Important Notes

- This is the documentation repository, not the Maho framework itself
- The main Maho framework repository is at https://github.com/MahoCommerce/maho
- Pull requests for the user guide, the developer docs, the API docs and the hosting docs go to
  the Maho repository. The other pages stay in this repository
- Always test documentation changes locally before submitting PRs
- The site uses Material theme features like search, social cards, and minification