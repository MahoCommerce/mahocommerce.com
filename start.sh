#!/bin/sh

docker build --build-arg CACHEBUST=$(date +%s) -t maho/mkdocs .
open http://localhost:8000
# MAHO_DOCS_SOURCE=../maho ./start.sh previews the docs of a local Maho checkout.
if [ -n "$MAHO_DOCS_SOURCE" ]; then
    set -- -v "$(cd "$MAHO_DOCS_SOURCE" && pwd)":/maho:ro -e MAHO_DOCS_SOURCE=/maho
fi
docker run --rm -it -p 8000:8000 -v .:/docs "$@" maho/mkdocs serve --dev-addr=0.0.0.0:8000 --livereload
