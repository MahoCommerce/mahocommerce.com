# Source of the mahocommerce.com website

Please test your changes with

```bash
docker run --rm -it -p 8000:8000 -v .:/docs squidfunk/mkdocs-material
```

then open your browser to [http://localhost:8000](http://localhost:8000).

Alternatively, run `./start.sh` which does all of the above.

## Tools used to convert old docs

- https://htmlmarkdown.com
- https://appdevtools.com/html-entity-encoder-decoder
- https://jsonformatter.org/json-pretty-print

...and a lot of manual work. :)

## To upgrade `requirements.txt`

```bash
docker run --rm -v "$(pwd):/app" -w /app python:3.12-slim sh -c "pip install --upgrade pip && pip install pip-upgrader && python3 -m pip install --upgrade setuptools && pip-upgrade --skip-virtualenv-check"
```