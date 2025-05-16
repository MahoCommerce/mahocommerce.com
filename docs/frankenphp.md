[FrankenPHP](https://frankenphp.dev/){target=_blank} is a modern application server for PHP built on top
of the [Caddy](https://caddyserver.com/){target=_blank} web server.

Maho runs perfectly on Apache, Nginx or Caddy (with PHP-FPM for all the previous)
but lately our webserver of choice is definitely [FrankenPHP](https://frankenphp.dev){target=_blank},
because it bundle together the Caddy web server, SSL termination with automatic certificate generation
and the PHP runtime, all in a single process and with great performance!

It also has a lot of great features (HTTP3, early hints and so much more),
check the official documentation for all the details.

## Maho's official docker images

Maho provides **official Docker images based on FrankenPHP**, making it easy to run Maho in containerized environments.
These images are automatically built via Docker Cloud Build and are available on
[hub.docker.com/r/mahocommerce/maho](https://hub.docker.com/r/mahocommerce/maho){target=_blank}.


## Static binary building

Creating a static binary for your application means bundling all the files of your PHP application
and the whole web server into a single binary file. This opens a whole new set of possibilities for deployment.

For Maho projects you can create it with:

```shell
# Clone FrankenPHP repository
git clone https://github.com/dunglas/frankenphp
cd frankenphp

# Build the standalone Maho app
EMBED=/path/to/your/mahoproject ./build-static.sh

# Now you can run the web server + your app with
cd dist
./frankenphp-mac-arm64 php-server --domain localhost

# And run the Maho CLI tool with
./frankenphp-mac-arm64 php-cli maho
```

!!! info
    For more info on options and configurations, check
    [FrankenPHP documentation](https://frankenphp.dev/docs/embed/){target=_blank}.

!!! warning
    Something that you'll have to consider is that the `local.xml` file will be bundled in the binary,
    and you won't be able to change it later, same for other folders like `var` and `media`.
    This is why this feature is still considered experimental,[get involved](community/get-involved.md)
    if you want to help.
