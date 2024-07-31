# Getting Started

!!! note
    Maho's is under heavy development so, at this moment, we suggest you to install it only if you want to
    see what's going on and to give it a try.

## System requirements

- PHP 8.2+
- Apache/Nginx/Caddy (we'll test a FrankenPHP builder ASAP)
- MySQL 5.7+ (8.0+ recommended) or MariaDB
- `patch` command 2.7+ (or `gpatch` on MacOS/HomeBrew)

## Create your project

```bash title="You'll be able to create a project based on Maho with:"
composer create-project -s dev mahocommerce/maho-starter yourproject
```

!!! note
    - `-s dev` is a temporary flag that will be removed when the final release will be ready
    - `yourproject` is the name of the folder where you want to create the project

## Configure your web server

With Maho you have to point your web server's document root to the `/pub` folder.  
This is a necessary step to ensure the highest level of security.

## More info

More documentation will come very soon, the project is extremely young so it will take a bit of time for us to
publish everything.

Thank you for your patience!  
Maho rocks! 🚀