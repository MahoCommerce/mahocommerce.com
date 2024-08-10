#!/bin/sh

docker build -t maho/mkdocs .
docker run --rm -it -p 8000:8000 -v .:/docs maho/mkdocs