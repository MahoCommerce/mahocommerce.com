---
description: Configure Apache, nginx, Caddy or FrankenPHP to serve a Maho storefront, with the document root, the front-controller rewrite and the file access rules each server needs.
---

# Web Server Configuration

Maho ships an Apache configuration in `public/.htaccess`. An Apache installation works after you
point the document root at `public/` and allow the file to run. For nginx, Caddy and FrankenPHP you
must write the equivalent rules yourself. This page lists them.

## What every web server must do

Every configuration must apply these rules:

- Serve the `public/` directory as the document root. Never expose the project root, because
  `app/etc/local.xml` holds the database password.
- Send every request that does not match an existing file to `public/index.php`.
- Execute PHP for the entry points only: `index.php`, `rest.php` and `api.php`.
- Serve the files under `/media`, `/skin` and `/js` directly, and return `404` when the file is
  absent.
- Deny access to hidden files. Allow the `/.well-known/` prefix, because it is a registered path
  prefix and not a hidden file.
- Deny access to backup, log and configuration files.
- Pass the `Authorization` header to PHP. Some FastCGI setups drop it, and the API needs it.

Route the `/api/*` paths as well. Those rules are separate, because they depend on the protocols
that you enable. See [API Web Server Configuration](../api/v2/web-server.md).

## URLs that Maho normalizes itself <span class="version-badge">v26.9+</span>

Do not copy the URL clean-up rules of Magento 1 or OpenMage. Maho answers with a `301` redirect on
its own for these cases:

| Request | Redirect target |
|---|---|
| `/index.php` | `/` |
| `/index.php/catalog/category/view/id/3` | `/catalog/category/view/id/3` |
| `/catalog//category` | `/catalog/category` |
| A URL with the wrong trailing-slash style | The style that **System > Configuration > Web > Url Options** defines |
| A URL on a host that is not the base URL | The base URL, when **Auto-redirect to Base URL** is on |
| An HTTP URL on a page that requires HTTPS | The same URL over HTTPS |

The redirect runs before the page renders, so it costs one request. It works the same on every web
server. A store that is installed in a subdirectory keeps the subdirectory prefix.

## Apache

Enable `mod_rewrite`, `mod_headers` and `mod_expires`. Then set the document root and allow the
bundled `.htaccess` file to run:

```apacheconf
<VirtualHost *:443>
    ServerName maho.example.com
    DocumentRoot /var/www/maho/public

    <Directory /var/www/maho/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

If `AllowOverride` is `None`, Apache ignores `public/.htaccess`. The storefront then returns `404`
on every page except the home page.

## nginx

nginx does not read `.htaccess`. Add a server block:

```nginx
server {
    listen 443 ssl;
    server_name maho.example.com;

    root /var/www/maho/public;
    index index.php;

    client_max_body_size 64M;

    # Store view selection. Leave both empty for the default store view.
    set $mage_run_code "";
    set $mage_run_type "store";

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    # These three directories hold static files only. A missing file must give a
    # 404, and must not start a full Maho bootstrap.
    location ~ ^/(media|skin|js)/ {
        try_files $uri =404;
        expires 1y;
        access_log off;
    }

    # Only the entry points execute PHP.
    location ~ ^/(index|rest|api)\.php(/|$) {
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_param HTTPS $https if_not_empty;
        fastcgi_param MAGE_RUN_CODE $mage_run_code;
        fastcgi_param MAGE_RUN_TYPE $mage_run_type;
        # Keep this value equal to max_execution_time in php.ini.
        fastcgi_read_timeout 600;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
    }

    # Any other .php file is data, not code.
    location ~ \.php$ {
        return 404;
    }

    location ~ /\.(?!well-known/) {
        deny all;
    }

    location ~* \.(bak|conf|dist|flag|ini|lock|log|md|neon|sample|sh|sql|yaml|yml)$ {
        deny all;
    }
}
```

The `location ~ ^/(index|rest|api)\.php(/|$)` block must come before the `location ~ \.php$` block.
nginx uses the first regular expression that matches.

## Caddy and FrankenPHP

The `php_server` directive already does the work of `try_files` and of the static file server, so
the site block stays short:

```caddyfile
maho.example.com {
    root * /var/www/maho/public
    encode zstd br gzip

    @hidden {
        path_regexp hidden /\.
        not path /.well-known/*
    }
    respond @hidden 404

    @private path *.bak *.conf *.dist *.flag *.lock *.log *.md *.neon *.sample *.sh *.sql *.yaml *.yml
    respond @private 404

    php_server
}
```

Caddy uses the Go regular expression engine, which has no negative lookahead. The `@hidden`
matcher therefore uses two conditions: a regular expression for the dot, and a `not path` exception
for `/.well-known/`.

The official Maho Docker images use the default FrankenPHP site block, and do not include these two
matchers. Add them to your own `Caddyfile` if you build on top of those images. See
[FrankenPHP](frankenphp.md).

## A second store view on a second domain

Maho reads the store view from the `MAGE_RUN_CODE` and `MAGE_RUN_TYPE` environment variables, and
never from the host name. To serve a second storefront on a second domain, set both variables in the
virtual host of that domain.

Apache:

```apacheconf
SetEnv MAGE_RUN_CODE french
SetEnv MAGE_RUN_TYPE store
```

nginx, in the server block of that domain:

```nginx
set $mage_run_code french;
set $mage_run_type store;
```

Caddy, in the site block of that domain:

```caddyfile
php_server {
    env MAGE_RUN_CODE french
    env MAGE_RUN_TYPE store
}
```

Use `website` as the value of `MAGE_RUN_TYPE` to select a website instead of a store view.

## Test the configuration

Run these three commands against a new installation:

```shell
# The home page must answer 200.
curl -sI https://maho.example.com/ | head -1

# The front controller must answer 301 and point at the root.
curl -sI https://maho.example.com/index.php | grep -iE '^(HTTP|location)'

# The configuration file must never be readable.
curl -sI https://maho.example.com/../app/etc/local.xml | head -1
```

If the second command answers `200`, the web server serves a duplicate copy of the storefront under
`/index.php`. Check that the request reaches PHP, because Maho produces the redirect, not the web
server.
