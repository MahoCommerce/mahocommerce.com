# Source of the mahocommerce.com website

Please test your changes by running `./start.sh`, which builds the local Docker image (based on `mkdocs-materialx`) and serves the site at [http://localhost:8000](http://localhost:8000).

## Tools used to convert old docs

- https://htmlmarkdown.com
- https://appdevtools.com/html-entity-encoder-decoder
- https://jsonformatter.org/json-pretty-print

...and a lot of manual work. :)

## To upgrade `requirements.txt`

Run `./upgrade-deps.sh`, which uses a temporary Docker container to upgrade dependencies via [`pur`](https://pypi.org/project/pur/).
