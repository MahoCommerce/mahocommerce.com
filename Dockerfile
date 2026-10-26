FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libcairo2 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir \
    mkdocs-git-revision-date-localized-plugin \
    mkdocs-awesome-pages-plugin \
    mkdocs-minify-plugin \
    mkdocs-redirects \
    pillow \
    cairosvg
ARG CACHEBUST=1
RUN pip install --no-cache-dir --upgrade mkdocs-materialx
# We never upgrade to MkDocs 2, so its warning is noise.
ENV DISABLE_MKDOCS_2_WARNING=true
WORKDIR /docs
EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000"]
