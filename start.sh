#!/bin/sh

docker build -t maho/mkdocs .
open http://localhost:8000
docker run --rm -it -p 8000:8000 -v .:/docs maho/mkdocs serve --dev-addr=0.0.0.0:8000 --livereload
