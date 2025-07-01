#!/bin/bash

# This script uses a temporary Docker container to upgrade python dependencies using pip-upgrader.

docker run --rm -v "$(pwd):/app" -w /app python:3.12-slim sh -c "pip install setuptools pip-upgrader && pip-upgrade --skip-package-installation -p all"