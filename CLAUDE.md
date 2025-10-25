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

### Build for Production
```bash
mkdocs build
```

## Key Architecture

### Configuration
- **mkdocs.yml**: Main configuration file containing site structure, theme settings, and plugin configurations
- **requirements.txt**: Python dependencies for MkDocs and plugins
- **docs/maho.css**: Custom CSS styling for the Maho brand

### Documentation Structure
- **docs/**: Main documentation content
  - **api/**: REST and SOAP API documentation
  - **blog/**: Release announcements and updates
  - **community/**: Contributing guides and community projects
  - **maho-for-devs/**: Developer guide covering MVC, ORM, and architecture
  - **assets/**: Images, logos, and static assets
  - **overrides/**: Custom MkDocs theme overrides

### Content Guidelines
- Documentation is written in Markdown
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
- Pull requests for documentation should be submitted to this repository
- Always test documentation changes locally before submitting PRs
- The site uses Material theme features like search, social cards, and minification