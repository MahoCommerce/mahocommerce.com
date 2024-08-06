# CLI tool

Every Maho based project comes with a tool to run various tasks from the command line, find it in the root of your
project:

```
$ ./maho

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display help for the given command. When no command is given display help for the list command
  -q, --quiet           Do not output any message
  -V, --version         Display this application version
      --ansi|--no-ansi  Force (or disable --no-ansi) ANSI output
  -n, --no-interaction  Do not ask any interactive question
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  completion             Dump the shell completion script
  help                   Display help for a command
  list                   List commands
  serve                  Run Maho with the built in server
 cache
  cache:disable          Disable all caches
  cache:enable           Enable all caches
  cache:flush            Flush cache
 customer
  customer:list          List all customers
 index
  index:list             List all indexes
  index:reindex          Reindex a single index
  index:reindex:all      Reindex all indexes
 legacy
  legacy:run-shell-file  Run legacy shell file
 log
  log:clean              Clean log tables in the database
  log:status             Show status for log tables in the database
```

This tool is inspired by [Laravel Artisan](https://laravel.com/docs/11.x/artisan),
[n98-magerun](https://github.com/netz98/n98-magerun), and it was created using the awesome
[Symfony Console](https://symfony.com/doc/current/console.html) component.

## Available commands

The list of the built-in commands is growing rapidly, at the moment of writing it is exactly the one listed above,
but if you run Maho's CLI tool in the next few days you'll probably find more commands to run.

All commands should be self-explanatory, also thanks to the inline descriptions.

## Add your custom commands

At the moment this is not possible, we will definitely work on this as the task in already on 
[our roadmap](https://github.com/orgs/MahoCommerce/projects/2/views/1).  
[Contact us](community/get-involved.md) if you want to help with the development, 
or if you have ideas on what we should add to the Maho's CLI tool. 
