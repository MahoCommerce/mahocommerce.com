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
  completion                  Dump the shell completion script
  help                        Display help for a command
  install                     Install Maho
  list                        List commands
  serve                       Run Maho with the built in web server
 admin
  admin:user:change-password  List all admin users
  admin:user:disable          Enable an admin user
  admin:user:enable           Enable an admin user
  admin:user:list             List all admin users
 cache
  cache:disable               Disable all caches
  cache:enable                Enable all caches
  cache:flush                 Flush cache
 cron
  cron:history                List cron jobs executions stored in the database
  cron:list                   List cron jobs configured in the XML files
  cron:run                    Run a group of cron processes (default/always) or a single job_code (eg: newsletter_send_all)
 customer
  customer:delete             Delete customers
  customer:list               List all customers
 index
  index:list                  List all indexes
  index:reindex               Reindex a single index
  index:reindex:all           Reindex all indexes
 log
  log:clean                   Clean log tables in the database
  log:status                  Show status for log tables in the database
 sys
  sys:currencies              Get all available currencies
  sys:locales                 Get all available locales
  sys:timezones               Get all available timezones
```

This tool is inspired by [Laravel Artisan](https://laravel.com/docs/11.x/artisan){:target="_blank"},
[n98-magerun](https://github.com/netz98/n98-magerun){:target="_blank"}, and it was created using the awesome
[Symfony Console](https://symfony.com/doc/current/console.html){:target="_blank"} component.

## Available commands

The list of the built-in commands is growing rapidly, at the moment yon can either run
`./maho` within your Maho based project or you can check
[Maho CLI commands directory](https://github.com/MahoCommerce/maho/tree/main/lib/MahoCLI/Commands){:target="_blank"}
within our GitHub repository.

All commands should be self-explanatory, also thanks to the inline descriptions.

## Add your custom commands

### Using the built-in command generator

The easiest way to create a new command is to run:

```bash
$ ./maho create-command
```

The generator will prompt you for:

1. Command name (e.g., `my-custom-command` or `cache:clean`)
2. Command description

It will automatically:

- Create the command file in the correct location (`lib/MahoCLI/Commands`)
- Set up the proper namespace and class name
- Add all necessary imports and boilerplate code

Now you can edit your newly create file in `lib/MahoCLI/Commands`.

### Manual creation

Alternatively, you can create commands manually:

1. Create `lib/MahoCLI/Commands` in the main directory of your project
2. Create your command file, e.g. `MyCustomCommand.php` in `lib/MahoCLI/Commands` just like:
```php
<?php

namespace MahoCLI\Commands;

use Mage;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'my-custom-command',
    description: 'This command is just a test'
)]
class MyCustomCommand extends BaseMahoCommand
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->iniMaho();

        $output->writeln("<info>IT WORKED!</info>");
        return Command::SUCCESS;
    }
}
```
3. Add a PSR4 autoload configuration in your `composer.json`
```
"autoload": {
    "psr-4": {
        "MahoCLI\\": "lib/MahoCLI"
    }
}
```
4. run `composer dump-autoload`

Now you can run `./maho` and you will see it appear in the list of available commands:
```
Available commands:
  completion                    Dump the shell completion script
  help                          Display help for a command
  install                       Install Maho
  list                          List commands
  my-custom-command             This command is just a test
  serve                         Run Maho with the built in web server
```

and you will be able to run it with

```
$ ./maho my-custom-command
IT WORKED!
```