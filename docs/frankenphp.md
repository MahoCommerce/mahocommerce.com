[FrankenPHP](https://frankenphp.dev/){target=_blank} is a modern application server for PHP built on top
of the [Caddy](https://caddyserver.com/){target=_blank} web server.

While Maho runs perfectly on both Caddy + PHP-FPM or FrankenPHP, this page is mainly about specific
characteristics of FrakenPHP, like the ability to create standalone, self-executable binaries
of your whole PHP application.

In this case:

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

!!! danger
    Support for FrankenPHP is still under development and heavy testing.  
    If you find issues and want to help, [get involved](community/get-involved.md) 😉