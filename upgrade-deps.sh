#!/bin/bash

# This script uses a temporary Docker container to upgrade python dependencies using pur.

docker run --rm -v "$(pwd):/app" -w /app python:3.12-slim sh -c "pip install pur && pur -r requirements.txt"