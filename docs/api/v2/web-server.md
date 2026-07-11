# Web Server Configuration <span class="version-badge">v26.7+</span>

All web servers must route the new API URLs (`/api/rest/v2/*`, `/api/graphql`, `/api/admin/graphql`, `/api/docs`) to `rest.php` (the Symfony API Platform entry point), while letting legacy paths (`/api/rest`, `/api/soap`, `/api/v2_soap`, `/api/xmlrpc`, `/api/jsonrpc`) fall through to the original Magento 1 controllers. Below are example configurations for the three most common setups.

### Why rest.php, not index.php?

`rest.php` boots the Symfony API Platform kernel directly. `index.php` boots the full Maho front-controller stack and then hands off to Symfony via `Maho_ApiPlatform_IndexController::indexAction`. The first path is ~50-100 ms faster per request, noticeable under chatty API clients (POS terminals, headless storefronts making 5-10 requests per user action).

Both paths end up at the same Symfony kernel; `rest.php` is just leaner. Maho is still initialised inside `rest.php` so store context, models, and config are available to API Platform resolvers.

### Rewrite rules are mandatory

The new API URLs are served **only** through `rest.php`; there is no `index.php` fallback. Without the rewrite rules below, `/api/*` requests fall through to Maho's normal front controller, where the legacy `Mage_Api` router claims them and tries to dispatch SOAP/XML-RPC, producing a fatal error instead of the API response. Configure the rules for your web server before using the API.

The bundled `public/.htaccess` already implements this routing for Apache. The snippets below are for installations using nginx/Caddy, or for operators who need to replicate the behaviour in a different web server.

### Legacy SOAP / XMLRPC / JSONRPC

`/api/rest`, `/api/soap`, `/api/v2_soap`, `/api/xmlrpc`, `/api/jsonrpc` are legacy Magento 1 API paths handled by the original `Mage_Api_*Controller` classes. The default `.htaccess` explicitly excludes them from the `rest.php` rewrite so they route to those controllers rather than the API Platform kernel. Two things gate whether they actually respond:

- **They are disabled by default.** Every protocol (the modern `rest_v2`, `graphql`, `admin_graphql` and the legacy `legacy_rest`, `soap`, `v2_soap`, `xmlrpc`, `jsonrpc`) defaults to **off** (**System → Configuration → Services → API Platform → API Protocols**). A disabled path returns `404` at the entry point; enable only the protocols you use.
- **SOAP / XML-RPC / JSON-RPC need optional packages.** Those adapters build on Laminas components that are not installed by default - they are declared under `suggest` in `composer.json`. To use them, install the matching package(s):

    ```bash
    composer require laminas/laminas-soap          # SOAP (soap, v2_soap)
    composer require laminas/laminas-xmlrpc         # XML-RPC (xmlrpc)
    composer require laminas/laminas-json-server    # JSON-RPC (jsonrpc)
    ```

    Without them, an enabled legacy protocol errors when it tries to instantiate the adapter. The modern REST v2 / GraphQL API has no such dependency. (The legacy Magento 1 REST at `/api/rest`, gated by `legacy_rest`, does not need any of these packages.)

### Nginx

Add these blocks **before** the main `location /` block in your nginx config.

```nginx
# API Platform endpoints (new REST + GraphQL + docs), no basic auth required.
# Matches /api/rest/v2/*, /api/graphql, /api/admin/graphql, /api/docs.
# Explicitly EXCLUDES legacy paths (/api/rest, /api/soap, /api/v2_soap,
# /api/xmlrpc, /api/jsonrpc) so the original Magento 1 controllers keep
# handling them.
location ~ ^/api/(rest/v2(/|$)|graphql$|admin/graphql$|docs(/|\.|$)) {
    # Bypass any site-wide basic auth / IP restrictions
    satisfy any;
    allow all;
    auth_basic off;

    # CORS headers for API access
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, Accept, X-Requested-With, X-Store-Code, X-Idempotency-Key, X-Order-Token, If-None-Match' always;
    add_header 'Access-Control-Expose-Headers' 'ETag, X-Idempotency-Replayed, Link' always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, Accept, X-Requested-With, X-Store-Code, X-Idempotency-Key, X-Order-Token, If-None-Match';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    # Route to Symfony API Platform via rest.php
    try_files $uri /rest.php$is_args$args;
}

# REST API PHP handler - no basic auth required
location = /rest.php {
    satisfy any;
    allow all;
    auth_basic off;

    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/your-pool.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param PATH_INFO $fastcgi_path_info;
    fastcgi_param PHP_VALUE "upload_max_filesize=100M \n post_max_size=100M \n max_execution_time=600";
    fastcgi_read_timeout 600;
    fastcgi_send_timeout 600;
    fastcgi_connect_timeout 60;
}

# Optional: Rate limiting for public mutation endpoints
# Define zone in the http {} block:
#   limit_req_zone $binary_remote_addr zone=api_write:10m rate=10r/s;
#
# Then add a location block BEFORE the API Platform block above:
#   location ~ ^/api/rest/v2/(newsletter|contact|auth/token|guest-carts) {
#       satisfy any;
#       allow all;
#       auth_basic off;
#       limit_req zone=api_write burst=5 nodelay;
#       try_files $uri /rest.php$is_args$args;
#   }
```

### Apache (.htaccess)

Add these rules to your `public/.htaccess` **before** the main `RewriteRule .* index.php` catch-all.

```apacheconf
<IfModule mod_rewrite.c>
    RewriteEngine on

    # ---- API Platform routing ----

    # Pass Authorization header through (required for JWT in CGI/FastCGI mode)
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle CORS preflight requests for new API endpoints
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteCond %{REQUEST_URI} ^/api/(rest/v2/|graphql|admin/graphql|docs)
    RewriteRule ^(.*)$ $1 [R=204,L]

    # Route new REST API to rest.php
    RewriteRule ^api/rest/v2 rest.php [QSA,L]

    # Legacy Magento 1 REST stays on api.php (must come AFTER the v2 rule)
    RewriteRule ^api/rest api.php?type=rest [QSA,L]

    # Route everything else under /api/* to rest.php, EXCEPT the legacy
    # SOAP/XML-RPC/JSON-RPC paths which fall through to index.php and the
    # original Mage_Api controllers.
    RewriteCond %{REQUEST_URI} !^/api/(soap|v2_soap|xmlrpc|jsonrpc)(/|$)
    RewriteRule ^api(/.*)?$ rest.php [QSA,L]

    # ---- End API Platform routing ----
</IfModule>

# CORS headers for API endpoints
<IfModule mod_headers.c>
    <LocationMatch "^/api/(rest/v2/|graphql|admin/graphql|docs)">
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization, Accept, X-Requested-With, X-Store-Code, X-Idempotency-Key, X-Order-Token, If-None-Match"
        Header always set Access-Control-Expose-Headers "ETag, X-Idempotency-Replayed, Link"
    </LocationMatch>
</IfModule>

# If using basic auth site-wide, exclude the API endpoints and rest.php:
#
# <LocationMatch "^/(api/|rest\.php)">
#     Satisfy Any
#     Allow from all
#     AuthType None
#     Require all granted
# </LocationMatch>
```

### FrankenPHP / Caddy

```caddyfile
maho.example.com {
    root * /var/www/maho/public

    # ---- API Platform routing ----

    # Match new API endpoints (REST + GraphQL + docs). Legacy paths
    # (/api/rest, /api/soap, /api/v2_soap, /api/xmlrpc, /api/jsonrpc)
    # are NOT included so they fall through to the Magento 1 controllers.
    @api {
        path /api/rest/v2/* /api/graphql /api/admin/graphql /api/docs*
    }
    header @api Access-Control-Allow-Origin "*"
    header @api Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    header @api Access-Control-Allow-Headers "Content-Type, Authorization, Accept, X-Requested-With, X-Store-Code, X-Idempotency-Key, X-Order-Token, If-None-Match"
    header @api Access-Control-Expose-Headers "ETag, X-Idempotency-Replayed, Link"

    # Handle CORS preflight
    @preflight {
        method OPTIONS
        path /api/rest/v2/* /api/graphql /api/admin/graphql /api/docs*
    }
    respond @preflight 204

    # Route new API URLs to rest.php
    @apiRoute {
        path /api/rest/v2/* /api/graphql /api/admin/graphql /api/docs*
        not file
    }
    rewrite @apiRoute /rest.php

    # ---- End API Platform routing ----

    # Static files
    @static file
    handle @static {
        file_server
    }

    # Everything else to index.php (Maho front controller)
    php_server {
        index index.php
    }
}

# Worker mode (optional, persistent PHP workers for better performance)
# Uncomment to use FrankenPHP worker mode with rest.php:
#
# {
#     frankenphp {
#         worker /var/www/maho/public/rest.php 4
#     }
# }
#
# Note: Worker mode keeps the PHP process alive between requests.
# Maho's Mage::init() runs once, subsequent requests reuse the bootstrap.
# This can significantly reduce response times but requires testing to
# ensure no state leaks between requests.
```
