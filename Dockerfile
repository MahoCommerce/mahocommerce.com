FROM squidfunk/mkdocs-material
RUN pip3 install mkdocs-git-revision-date-localized-plugin
RUN pip3 install mkdocs-awesome-pages-plugin
