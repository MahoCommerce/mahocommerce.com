## Introduction

On any fast paced software development project, the task of keeping the development and production databases in sync become a sticky wicket. Maho offers a system to create versioned resource migration scripts that can help your team deal with this often contentious part of the development process.

In the ORM article we created a model for a weblog post. At the time, we ran our CREATE TABLE statements directly against the database. This time, we'll create a Setup Resource for our module that will create the table for us. We'll also create an upgrade script for our module that will update an already installed module. The steps we'll need to take are

1.  Add the Setup Resource to our config
2.  Create our resource class file
3.  Create our installer script
4.  Create our upgrade script

## Adding the Setup Resource

In our `<global />` section, add the following

```xml
<global>
    <!-- ... -->
    <resources>
        <weblog_setup>
            <setup>
                <module>Mahotutorial_Weblog</module>
                <class>Mahotutorial_Weblog_Model_Resource_Setup</class>
            </setup>
        </weblog_setup>
    </resources>
    <!-- ... -->
</global>
```

The `<weblog_setup>` tag will be used to uniquely identify this Setup Resource. It's encouraged, but not necessary, that you use the modelname_setup naming convention. The `<module>Mahotutorial_Weblog</module>` tag block should contain the Packagename_Modulename of your module. Finally, `<class>Mahotutorial_Weblog_Model_Resource_Setup</class>` should contain the name of the class we'll be creating for our Setup Resource. For basic setup scripts it's not necessary to create a custom class, but by doing it now you'll give yourself more flexibility down the line.

After adding the above section to your config, clear your Maho cache and try to load any page of your Maho site. You'll see an exception something like

Fatal error: Class 'Mahotutorial_Weblog_Model_Resource_Setup' not found in

Maho just tried to instantiate the class you specified in your config, but couldn't find it. You'll want to create the following file, with the following contents.

File: app/code/local/Mahotutorial/Weblog/Model/Resource/Setup.php

```php
class Mahotutorial_Weblog_Model_Resource_Setup extends Mage_Core_Model_Resource_Setup
{
}
```

Now, reload any page of your Maho site. The exception should be gone, and your page should load as expected.

## Creating our Installer Script

Next, we'll want to create our installer script. This is the script that will contain any CREATE TABLE or other SQL code that needs to be run to initialize our module.

First, take a look at your config.xml file

```xml
<modules>
    <Mahotutorial_Weblog>
        <version>0.1.0</version>
    </Mahotutorial_Weblog>
</modules>
```

This section is required in all config.xml files, and identifies the module as well as the its version number. Your installer script's name will be based on this version number. The following assumes the current version of your module is 0.1.0.

Create the following file at the following location

File: app/code/local/Mahotutorial/Weblog/sql/weblog_setup/mysql4-install-0.1.0.php

```php
echo 'Running This Upgrade: '.get_class($this)."n <br /> n";
die("Exit for now");
```

The weblog_setup portion of the path should match the tag you created in your config.xml file (<weblog_setup />). The 0.1.0 portion of the filename should match the starting version of your module. Clear your Maho cache and reload any page in your Maho site and you should see something like

Running This Upgrade: Mahotutorial_Weblog_Model_Resource_Setup
Exit for now
 ...

Which means your update script ran. Eventually we'll put our SQL update scripts here, but for now we're going to concentrate on the setup mechanism itself. Remove the "die" statement from your script so it looks like the following

```php
echo 'Running This Upgrade: '.get_class($this)."n <br /> n";
```

Reload your page. You should see your upgrade message displayed at the top of the page. Reload again, and your page should be displayed as normal.

## Resource Versions

Maho's Setup Resources allow you to simply drop your install scripts (and upgrade scripts, which we'll get to in a bit) onto the server, and have the system automatically run them. This allows you to have all your database migrations scripts stored in the system in a consistent format.

Using your favorite database client, take a look at the core_setup table

```sql
mysql> select * from core_resource;
    +-------------------------+------------+--------------+
    | code                    | version    | data_version |
    +-------------------------+------------+--------------+
    | adminnotification_setup | 1.6.0.0    | 1.6.0.0      |
    | admin_setup             | 1.6.1.0    | 1.6.1.0      |
    | api2_setup              | 1.0.0.0    | 1.0.0.0      |
    | api_setup               | 1.6.0.0    | 1.6.0.0      |
    | backup_setup            | 1.6.0.0    | 1.6.0.0      |
    | bundle_setup            | 1.6.0.0.1  | 1.6.0.0.1    |
    | captcha_setup           | 1.7.0.0.0  | 1.7.0.0.0    |
    | catalogindex_setup      | 1.6.0.0    | 1.6.0.0      |
    | cataloginventory_setup  | 1.6.0.0.2  | 1.6.0.0.2    |
    | catalogrule_setup       | 1.6.0.3    | 1.6.0.3      |
    | catalogsearch_setup     | 1.6.0.0    | 1.6.0.0      |
    | catalog_setup           | 1.6.0.0.14 | 1.6.0.0.14   |
    | checkout_setup          | 1.6.0.0    | 1.6.0.0      |
    | cms_setup               | 1.6.0.0.1  | 1.6.0.0.1    |
    | compiler_setup          | 1.6.0.0    | 1.6.0.0      |
    | contacts_setup          | 1.6.0.0    | 1.6.0.0      |
    | core_setup              | 1.6.0.2    | 1.6.0.2      |
    | cron_setup              | 1.6.0.0    | 1.6.0.0      |
    | customer_setup          | 1.6.2.0.1  | 1.6.2.0.1    |
    | dataflow_setup          | 1.6.0.0    | 1.6.0.0      |
    | directory_setup         | 1.6.0.1    | 1.6.0.1      |
    | downloadable_setup      | 1.6.0.0.2  | 1.6.0.0.2    |
    | eav_setup               | 1.6.0.0    | 1.6.0.0      |
    | giftmessage_setup       | 1.6.0.0    | 1.6.0.0      |
    | googleanalytics_setup   | 0.1.0      | 0.1.0        |
    | googlecheckout_setup    | 1.6.0.1    | 1.6.0.1      |
    | importexport_setup      | 1.6.0.2    | 1.6.0.2      |
    | index_setup             | 1.6.0.0    | 1.6.0.0      |
    | log_setup               | 1.6.0.0    | 1.6.0.0      |
    | moneybookers_setup      | 1.6.0.0    | 1.6.0.0      |
    | newsletter_setup        | 1.6.0.1    | 1.6.0.1      |
    | oauth_setup             | 1.0.0.0    | 1.0.0.0      |
    | paygate_setup           | 1.6.0.0    | 1.6.0.0      |
    | payment_setup           | 1.6.0.0    | 1.6.0.0      |
    | paypaluk_setup          | 1.6.0.0    | 1.6.0.0      |
    | paypal_setup            | 1.6.0.2    | 1.6.0.2      |
    | persistent_setup        | 1.0.0.0    | 1.0.0.0      |
    | poll_setup              | 1.6.0.0    | 1.6.0.0      |
    | productalert_setup      | 1.6.0.0    | 1.6.0.0      |
    | rating_setup            | 1.6.0.0    | 1.6.0.0      |
    | reports_setup           | 1.6.0.0.1  | 1.6.0.0.1    |
    | review_setup            | 1.6.0.0    | 1.6.0.0      |
    | salesrule_setup         | 1.6.0.3    | 1.6.0.3      |
    | sales_setup             | 1.6.0.7    | 1.6.0.7      |
    | sendfriend_setup        | 1.6.0.0    | 1.6.0.0      |
    | shipping_setup          | 1.6.0.0    | 1.6.0.0      |
    | sitemap_setup           | 1.6.0.0    | 1.6.0.0      |
    | tag_setup               | 1.6.0.0    | 1.6.0.0      |
    | tax_setup               | 1.6.0.3    | 1.6.0.3      |
    | usa_setup               | 1.6.0.1    | 1.6.0.1      |
    | weblog_setup            | 0.1.0      | 0.1.0        |
    | weee_setup              | 1.6.0.0    | 1.6.0.0      |
    | widget_setup            | 1.6.0.0    | 1.6.0.0      |
    | wishlist_setup          | 1.6.0.0    | 1.6.0.0      |
    | xmlconnect_setup        | 1.6.0.0    | 1.6.0.0      |
    +-------------------------+------------+--------------+
    55 rows in set (0.00 sec)
```

This table contains a list of all the installed modules, along with the installed version number. You can see our module near the end

```
| weblog_setup            | 0.1.0      | 0.1.0        |
```

This is how Maho knows not to re-run your script on the second, and on all successive, page loads. The weblog_setup is already installed, so it won't be updated. If you want to re-run your installer script (useful when you're developing), just delete the row for your module from this table. Let's do that now, and actually add the SQL to create our table. So first, run the following SQL.

```sql
DELETE from core_resource where code = 'weblog_setup';
```

We'll also want to drop the table we manually created in the ORM article.

```sql
DROP TABLE blog_posts;
```

Then, add the following code to your setup script.

```php
$installer = $this;
$installer->startSetup();
$installer->run("
    CREATE TABLE `{$installer->getTable('weblog/blogpost')}` (
      `blogpost_id` int(11) NOT NULL auto_increment,
      `title` text,
      `post` text,
      `date` datetime default NULL,
      `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP,
      PRIMARY KEY  (`blogpost_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    INSERT INTO `{$installer->getTable('weblog/blogpost')}` VALUES (1,'My New Title','This is a blog post','2009-07-01 00:00:00','2009-07-02 23:12:30');
");
$installer->endSetup();
```

Clear your Maho cache and reload any page in the system. You should have a new blog_posts table with a single row.

## Anatomy of a Setup Script

So, let's go over the script line-by-line. First, there's this (or is that $this?)

```php
$installer = $this;
```

Each installer script is run from the context of a Setup Resource class, the class you created above. That means any reference to $this from within the script will be a reference to an object instantiated from this class. While not necessary, most setup scripts in the core modules will alias $this to a variable called installer, which is what we've done here. While not necessary, it is the convention and it's always best to follow the convention unless you have a good reason for breaking it.

Next, you'll see our queries are bookended by the following two method calls.

```php
$installer->startSetup();
//...
$installer->endSetup();
```

If you take a look at the Mage_Core_Model_Resource_Setup class in app/code/core/Mage/Core/Model/Resource/Setup.php (which your setup class inherits from) you can see that these methods do some basic SQL setup

```php
public function startSetup()
{
    $this->getConnection()->startSetup()
    return $this;
}

public function endSetup()
{
    $this->getConnection()->endSetup();
    return $this;
}
```

You can look into Varien_Db_Adapter_Pdo_Mysql in lib/Varien/Db/Adapter/Pdo/Mysql.php to find the real SQL setup executed for MySQL connections in the startSetup() and endSetup() methods.

Finally, there's the call to the run method

```php
$installer->run(...);
```

which accepts a string containing the SQL needed to setup your database table(s). You may specify any number of queries, separated by a semi-colon. You also probably noticed the following

```php
$installer->getTable('weblog/blogpost')
```

The getTable method allows you to pass in a Maho Model URI and get its table name. While not necessary, using this method ensures that your script will continue to run, even if someone changes the name of their table in the config file. The Mage_Core_Model_Resource_Setup class contains many useful helper methods like this. The best way to become familiar with everything that's possible is to study the installer scripts used by the core Maho modules.

## RDBMS Agnostic Scripts

Since version 1.6, Maho (in theory) supports more database backends then only MySQL. Since our setup script contains raw SQL statements, it may not run correctly on a different database system, say MSSQL. For that reason the setup script name is prefixt with the string mysql4-

In order to make setup scripts cross-database compatible, Maho offers a DDL (Data Definition Language) Table object. Here is an alternative version of our setup script that would run on any supported RDBMS.

File: `app/code/local/Mahotutorial/Weblog/sql/weblog_setup/mysql4-install-0.1.0.php`

```php
$installer = $this;
$installer->startSetup();
$table = $installer->getConnection()->newTable($installer->getTable('weblog/blogpost'))
    ->addColumn('blogpost_id', Varien_Db_Ddl_Table::TYPE_INTEGER, null, array(
        'unsigned' => true,
        'nullable' => false,
        'primary' => true,
        'identity' => true,
        ), 'Blogpost ID')
    ->addColumn('title', Varien_Db_Ddl_Table::TYPE_TEXT, null, array(
        'nullable' => false,
        ), 'Blogpost Title')
    ->addColumn('post', Varien_Db_Ddl_Table::TYPE_TEXT, null, array(
        'nullable' => true,
        ), 'Blogpost Body')
    ->addColumn('date', Varien_Db_Ddl_Table::TYPE_DATETIME, null, array(
        ), 'Blogpost Date')
    ->addColumn('timestamp', Varien_Db_Ddl_Table::TYPE_TIMESTAMP, null, array(
        ), 'Timestamp')
    ->setComment('Mahotutorial weblog/blogpost entity table');
$installer->getConnection()->createTable($table);

$installer->endSetup();
```

As you can see, there is no raw SQL in this version of the setup script. So which version should you use? If you want your Modules to run on any RDBMS backend, use the new DDL style upgrade scripts. If you are concerned about backward compatibility, use the raw SQL flavor, that is still supported by Maho 1.6 and 1.7 (and probably will be supported by any 1.x Maho release).

## Module Upgrades

So, that's how you create a script that will setup your initial database tables, but what if you want to alter the structure of an existing module? Maho's Setup Resources support a simple versioning scheme that will let you automatically run scripts to **upgrade** your modules.

Once Maho runs an _installer_ script for a module, it will **never run another installer for that module again** (short of manually deleting the reference in the core_resource table). Instead, you'll need to create an upgrade script. Upgrade scripts are very similar to installer scripts, with a few key differences.

To get started, we'll create a script at the following location, with the following contents

File: app/code/local/Mahotutorial/Weblog/sql/weblog_setup/upgrade-0.1.0-0.2.0.php:

```php
echo 'Testing our upgrade script (upgrade-0.1.0-0.2.0.php) and halting execution to avoid updating the system version number   
';
die();
```

Upgrade scripts are placed in the same folder as your installer script, but named slightly differently. First, and most obviously, the file name contains the word upgrade. Secondly, you'll notice there are **two** version numbers, separated by a "-". The first (0.1.0) is the module version that we're upgrading **from**. The second (0.2.0) is the module version we're upgrading **to**.

If we cleared our Maho cache and reloaded a page, our script wouldn't run. We need to update the version number in our module's config.xml file to trigger the upgrade

```xml
<modules>
    <Mahotutorial_Weblog>
        <version>0.2.0</version>
    </Mahotutorial_Weblog>
</modules>
```

With the new version number in place, we'll need to clear our Maho cache and load any page in our Maho site. You should now see output from your upgrade script.

By the way, we also could have names our upgrade script mysql4-upgrade-0.1.0-0.2.0.php. This would indicate our upgrade would contain MySQL specific SQL.

Before we continue and actually implement the upgrade script, there's one important piece of behavior you'll want to be aware of. Create another upgrade file at the following location with the following contents.

File: app/code/local/Mahotutorial/Weblog/sql/weblog_setup/upgrade-0.1.0-0.1.5.php:

```php
echo 'Testing our upgrade script (upgrade-0.1.0-0.1.5.php) and NOT halting execution <br />';
```

If you reload a page, you'll notice you see BOTH messages. When Maho notices the version number of a module has changed, it will run through **all** the setup scripts needed to bring that version up to date. Although we never really created a version 0.1.5 of the Weblog module, Maho sees the upgrade script, and will attempt to run it. Scripts will be run in order from lowest to highest. If you take a peek at the core_resource table,

```sql
mysql> select * from core_resource where code = 'weblog_setup';
+--------------+---------+--------------+
| code         | version | data_version |
+--------------+---------+--------------+
| weblog_setup | 0.1.5   | 0.1.5        |
+--------------+---------+--------------+
1 row in set (0.00 sec)
```

you'll notice Maho considers the version number to be 1.5. That's because we completed executing the 1.0 to 1.5 upgrade, but did not complete execution of the 1.0 to 2.0 upgrade.

So, with all that out of the way, writing our actual upgrade script is identical to writing an installer script. Let's change the 0.1.0-0.2.0 script to read

```php
$installer = $this;
$installer->startSetup();
$installer->getConnection()
    ->changeColumn($installer->getTable('weblog/blogpost'), 'post', 'post', array(
        'type' => Varien_Db_Ddl_Table::TYPE_TEXT,
        'nullable' => false,
        'comment' => 'Blogpost Body'
    )
);
$installer->endSetup();
die("You'll see why this is here in a second");
```

Try refreshing a page in your Maho site and ... nothing. The upgrade script didn't run. The post field in our table still allows null values, and more importantly, the call to die() did not halt execution. Here's what happened

1.  The weblog_setup resource was at version 0.1.0
2.  We upgraded our module to version 0.2.0
3.  Maho saw the upgraded module, and saw there were two upgrade scripts to run; 0.1.0 to 0.1.5 and 0.1.0 to 0.2.0
4.  Maho queued up both scripts to run
5.  Maho ran the 0.1.0 to 0.1.5 script
6.  The weblog_setup resource is now at version 0.1.5
7.  Maho ran the 0.1.0 to 0.2.0 script, execution was halted
8.  On the next page load, Maho saw weblog_setup at version 0.1.5 and did not see any upgrade scripts to run since both scripts indicated they should be run **from** 0.1.0

The correct way to achieve what we wanted would have been to name our scripts as follows

```
upgrade-0.1.0-0.1.5.php #This goes from 0.1.0 to 0.1.5
upgrade-0.1.5-0.2.0.php #This goes 0.1.5 to 0.2.0
```

Maho is smart enough to run both scripts on a single page load. You can go back in time and give this a try by updating the core_resource table

```sql
UPDATE core_resource SET version = '0.1.0', data_version = '0.1.0' WHERE code = 'weblog_setup';
...
```

It's one of the odd quirks of the Maho system that the updates will run as previously configured. This means you'll want to be careful with multiple developers adding update scripts to the system. You'll either want a build-meister/deployment-manager type in charge of the upgrade scripts or (heaven forbid) developers will need to talk to one another.