FROM python:3.12-slim
RUN pip install --no-cache-dir \
    mkdocs-git-revision-date-localized-plugin \
    mkdocs-awesome-pages-plugin \
    mkdocs-minify-plugin \
    pillow \
    cairosvg
ARG CACHEBUST=1
RUN pip install --no-cache-dir --upgrade mkdocs-materialx
WORKDIR /docs
EXPOSE 8000
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000"]
