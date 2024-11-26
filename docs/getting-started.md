# Getting Started

## System requirements

- PHP 8.2+
- Apache/Nginx/Caddy/FrankenPHP[^1]
- MySQL 5.7+ (8.0+ recommended) or MariaDB
- `patch` command 2.7+ (or `gpatch` on macOS/HomeBrew)

## Create your project

```bash
composer create-project mahocommerce/maho-starter yourproject
```

!!! info
    - `yourproject` is the name of the directory where you want to create the project

## Configure your web server

With Maho you have to point your web server's document root to the `/public` directory.  
This is a necessary step to ensure the highest level of security.

### Local development server

Alternatively, if you're just developing on your computer, you can run `./maho serve` 
to start the built-in PHP web server (you will still need a database tho).

```
./maho serve --help
Description:
  Run Maho with the built in server

Usage:
  serve [<port>]

Arguments:
  port                  Default is 8000 [default: 8000]
```

```
./maho serve
Serving Maho on http://127.0.0.1:8000, press CTRL+C to exit...
```

### Do you like docker?

If docker is your go-to choice then we suggest you check the [Docker Starter](community/projects/docker-starter.md)
community project by Simone Fantini.

## Install Maho

This is the moment where the database tables are created and the first settings are set.  
So, reach to your sysadmins and ask them to create a database on your server(s) and give you
the access credentials, you'll need them in a minute.

There are two ways of installing Maho to your database:

* via command line, using the [maho CLI tool](cli-tool.md)
* via web on your browser, with the web installer

### Command line installation

```
./maho install --help

Usage:
  install [options]

Options:
      --license_agreement_accepted=LICENSE_AGREEMENT_ACCEPTED  It will accept "yes" value only
      --locale=LOCALE                                          Locale
      --timezone=TIMEZONE                                      Timezone
      --default_currency=DEFAULT_CURRENCY                      Default currency
      --db_host=DB_HOST                                        You can specify server port (localhost:3307) or UNIX socket (/var/run/mysqld/mysqld.sock)
      --db_name=DB_NAME                                        Database name
      --db_user=DB_USER                                        Database username
      --db_pass=DB_PASS                                        Database password
      --db_prefix[=DB_PREFIX]                                  Database Tables Prefix. No table prefix will be used if not specified [default: ""]
      --session_save[=SESSION_SAVE]                            Where to store session data (files/db) [default: "files"]
      --admin_frontname[=ADMIN_FRONTNAME]                      Admin panel path, "admin" by default [default: "admin"]
      --url=URL                                                URL the store is supposed to be available at
      --use_secure[=USE_SECURE]                                Use Secure URLs (SSL). Enable this option only if you have SSL available. [default: false]
      --secure_base_url[=SECURE_BASE_URL]                      Secure Base URL. Provide a complete base URL for SSL connection. For example: https://mydomain.com/
      --use_secure_admin[=USE_SECURE_ADMIN]                    Run admin interface with SSL [default: false]
      --admin_lastname=ADMIN_LASTNAME                          Admin user last name
      --admin_firstname=ADMIN_FIRSTNAME                        Admin user first name
      --admin_email=ADMIN_EMAIL                                Admin user email
      --admin_username=ADMIN_USERNAME                          Admin user login
      --admin_password=ADMIN_PASSWORD                          Admin user password
      --encryption_key[=ENCRYPTION_KEY]                        Will be automatically generated and displayed on success, if not specified
      --sample_data[=SAMPLE_DATA]                              Also install sample data
  -h, --help                                                   Display help for the given command. When no command is given display help for the list command
  -q, --quiet                                                  Do not output any message
  -V, --version                                                Display this application version
      --ansi|--no-ansi                                         Force (or disable --no-ansi) ANSI output
  -n, --no-interaction                                         Do not ask any interactive question
  -v|vv|vvv, --verbose                                         Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
```

Sample of a complete CLI installation command:

```
./maho install \
--license_agreement_accepted yes \
--locale en_US --timezone Europe/London --default_currency EUR \ 
--db_host localhost --db_name maho --db_user root --db_pass root \
--url http://yourdomain.test/ --secure_base_url http://yourdomain.test/ \
--use_secure 0 --use_secure_admin 0 \
--admin_lastname admin --admin_firstname admin \
--admin_email admin@admin.com --admin_username admin \ 
--admin_password samplepassword
```

If you need a list of the available currencies, locales or timezones, simply run one of these commands:
```
./maho sys:currencies
./maho sys:locales
./maho sys:timezones
```

#### Sample data

Maho sample data is a ready-made demo online store that you can play with to learn how Maho works,
without having to build and configure everything from scratch.

To install Maho with sample data, just add `--sample_data 1` to the installation, eg:

```
./maho install \
--license_agreement_accepted yes \
--locale en_US --timezone Europe/London --default_currency EUR \ 
--db_host localhost --db_name maho --db_user root --db_pass root \
--url http://yourdomain.test/ --secure_base_url http://yourdomain.test/ \
--use_secure 0 --use_secure_admin 0 \
--admin_lastname admin --admin_firstname admin \
--admin_email admin@admin.com --admin_username admin \ 
--admin_password samplepassword \
--sample_data 1
```

and everything will be automatically downloaded and setup for you by Maho installer.

!!! info
    Remember to revise and adapt all the parameters above, like the database host/username/password,
    the admin password and so on.

### Installation via the web installer

If you're not familiar with the command line, simply open your browser to type the URL
you configured in your web server, pointing to your Maho project `public` directory,
the web installer will start automatically, and you'll be guided
through the complete installation of Maho into your database.

!!! warning
    Sample data installation is not available using the web installer.

## Cron setup

Please check [cron setup dedicated documentation](cron.md).

[^1]: Standalone binary building with FrankenPHP is untested at the moment.