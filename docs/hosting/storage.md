---
description: Put the Maho media, exports, imports, feeds and sitemaps on S3, Google Cloud Storage or Azure Blob Storage, so that several web nodes can run with no shared disk.
---

# Shared storage <span class="version-badge">v26.11+</span>

Maho keeps the files that all web nodes must see on **storage mounts**. A mount is a named
[Flysystem](https://flysystem.thephpleague.com/){target=_blank} filesystem. By default, each
mount is a local folder, and a single-node store needs no configuration.

To run several nodes with no shared disk, point the mounts at a bucket in `app/etc/local.xml`.
Each node then reads and writes the same files, and a node can start with an empty `public/media`.

## The mounts

| Mount          | Local folder         | Contents                                                        |
|----------------|----------------------|-----------------------------------------------------------------|
| `media`        | `public/media`       | Product, category and CMS images, downloadable files, feed files |
| `exports`      | `var/export`         | Dataflow export files                                           |
| `imports`      | `var/import`         | Dataflow import files and profile uploads                       |
| `importexport` | `var/importexport`   | Import/Export source files                                      |
| `feeds`        | `var/feedmanager`    | The state of a feed generation that runs in batches             |
| `sitemaps`     | `public`             | The sitemap files                                               |

The cache, the sessions, the logs, `var/tmp` and the locks are not on a mount. Put the cache and
the sessions on [Redis](redis.md). Each node keeps its own logs and temporary files.

## Install the adapter package

Maho includes the local adapter only. Install the package for your storage service:

| Service                                                     | `<type>` | Package                                 |
|-------------------------------------------------------------|----------|-----------------------------------------|
| Amazon S3 and S3-compatible (MinIO, Cloudflare R2, Spaces)  | `s3`     | `league/flysystem-aws-s3-v3`            |
| Google Cloud Storage                                        | `gcs`    | `league/flysystem-google-cloud-storage` |
| Azure Blob Storage                                          | `azure`  | `azure-oss/storage-blob-flysystem`      |

```bash
composer require league/flysystem-aws-s3-v3
```

## Configure a mount

Add a `<storage>` block to `app/etc/local.xml`. A mount in `local.xml` replaces the adapter of the
mount with the same name. This example puts the `media` mount on S3, behind a CDN:

```xml
<config>
    <global>
        <storage>
            <mounts>
                <media>
                    <public_url>https://cdn.example.com/media/</public_url>
                    <adapter>
                        <type>s3</type>
                        <bucket>my-store-media</bucket>
                        <prefix>media</prefix>
                        <region>eu-west-1</region>
                        <key>AKIA...</key>
                        <secret>...</secret>
                    </adapter>
                </media>
            </mounts>
        </storage>
    </global>
</config>
```

The elements of a mount:

- `<public_url>`: the URL prefix of the files. Maho writes it in the product image URLs and in the
  other media URLs. Without it, Maho uses the URL that the adapter gives, which is usually the
  bucket URL.
- `<visibility>`: `public` or `private`, the visibility that Maho sets on each write. Do not set it
  on an S3 bucket with ACLs disabled, which is the default for new buckets. Give read access with
  a bucket policy instead.
- `<adapter>`: the storage service. `<type>` selects the adapter, and the other elements are its
  options.

The adapter options:

- **s3**: `bucket` (required), `prefix`, `region` (default `us-east-1`), `key` and `secret`,
  `endpoint`, `use_path_style_endpoint`. Set both `key` and `secret`, or neither. With neither,
  the AWS SDK finds the credentials itself, for example from an instance role. MinIO needs
  `endpoint` and `use_path_style_endpoint`.
- **gcs**: `bucket` (required), `prefix`, `project_id`, `key_file`. `key_file` is the path to a
  service account JSON file. Without it, the Google client finds the credentials itself.
- **azure**: `container` (required), `connection_string` (required), `prefix`,
  `public_container`. Set `public_container` when the container serves files without a
  signature.

Use one bucket or one prefix for each mount. Only the `media` mount holds public files. Keep the
other mounts in a bucket that allows no public read.

## Private files in the media mount

Three folders of the `media` mount hold files that only Maho can serve:

- `customer/`: the files that customers upload with a customer or address attribute.
- `custom_options/`: the files that customers upload with a product custom option.
- `downloadable/`: the files that customers buy.

Do not allow a public read on these folders. On the local disk, the web server denies them. On a
bucket, the bucket policy must deny them. This S3 policy allows a public read on every object of
the bucket, except the three folders:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "NotResource": [
                "arn:aws:s3:::my-store-media/media/customer/*",
                "arn:aws:s3:::my-store-media/media/custom_options/*",
                "arn:aws:s3:::my-store-media/media/downloadable/*"
            ]
        }
    ]
}
```

Make sure that a private file answers `403`, and that a product image answers `200`:

```bash
curl -I https://my-store-media.s3.eu-west-1.amazonaws.com/media/downloadable/files/links/a/b/file.zip
curl -I https://my-store-media.s3.eu-west-1.amazonaws.com/media/catalog/product/a/b/image.jpg
```

A customer downloads a purchased file through Maho. When the mount can sign a URL, Maho sends a
redirect to a signed URL that expires after 15 minutes. Otherwise, Maho streams the file itself.

## Resized product images

Maho resizes a product image on the first request for it. The template writes the URL of the
resized file, and the resized file does not exist yet. The web server sends the miss under
`/media/catalog/product/cache/` to `index.php`, and Maho creates the file, stores it on the
`media` mount and returns it. The next requests get the stored file.

On the local disk, the rules in [Web server configuration](web-server.md) do this. On a bucket,
the bucket answers the miss, so the URL in `<public_url>` must send the miss to the store host.
Configure the CDN to retry a `403` or a `404` under `/media/catalog/product/cache/` on the store
host, with the same path:

- **Amazon CloudFront**: make an origin group with the bucket as the primary origin and the store
  host as the secondary origin. Set the failover status codes to `403` and `404`. Use the origin
  group in the behavior for `/media/catalog/product/cache/*`.
- **Other CDNs**: use the origin failover or the error rule of the CDN with the same settings.

The path must be the same on the CDN and on the store host. With `<prefix>media</prefix>` and a
`<public_url>` that ends in `/media/`, the paths are the same.

Maho resizes only the sizes that a template rendered. A request for any other size answers `404`.
So a visitor cannot fill the bucket with sizes that the store does not use.

## Move an existing store

Do these steps on one node, with the old local folders still in place:

1. Install the adapter package.
2. Add the `<storage>` block to `app/etc/local.xml`.
3. Copy the files to the bucket:

    ```bash
    ./maho storage:migrate --dry-run
    ./maho storage:migrate
    ```

4. Flush the cache with `./maho cache:flush`.
5. Resize the product images before the visitors ask for them:

    ```bash
    ./maho media:warm
    ```

6. Generate the sitemaps again, if the `sitemaps` mount moved.
7. Check the store. Then deploy the same `local.xml` on the other nodes.
8. Delete the old local folders.

`storage:migrate` without an argument copies every mount that is not local. To copy some mounts
only, give their names: `./maho storage:migrate media exports`. The command has these features:

- It never changes the local files.
- It skips a file that is on the bucket already with the same size. If the command stops, run it
  again: it copies only the files that are missing.
- It does not copy the folders that Maho creates again: `catalog/product/cache`,
  `catalog/swatches` and `tmp` in the `media` mount. `--include-cache` copies them, and
  `--exclude=FOLDER` excludes more folders.
- It does not copy the `sitemaps` mount, because its local folder is `public/`. Generate the
  sitemaps again after the switch.
- It returns an error code when a file fails, and lists the files that failed.

`media:warm` resizes each product image to each size that a template rendered. `--product=ID`
resizes the images of one product, and you can give the option more than once.
`--prune=DAYS` first deletes the sizes that no template rendered during that number of days. Use
it after a theme change, so that Maho stops resizing the images to the old sizes.

## For extension developers

A file that all nodes must see goes through a named mount. A file that one node uses alone stays
on the local disk.

- Get a mount with `Mage::getStorage('media')`. It is a Flysystem `Filesystem`, so use `write()`,
  `read()`, `fileExists()`, `delete()` and `listContents()` on it.
- Get the URL of a file with `Mage::getStorage('media')->publicUrl($path)`. Do not join
  `Mage::getBaseUrl('media')` and a path: that URL is wrong when the mount is on a CDN.
- Store an upload with `$uploader->saveToStorage(Mage::getStorage('media'), 'my_module')`. The
  upload goes from the PHP temporary file to the mount, with no local copy.
- Before you read or delete a file whose name comes from a request or from the database, check
  the name with `\Maho\Io::getPathWithinMount($mount, 'my_module', $name)`. It returns `null` when
  the name leaves the folder.
- Write a file that a visitor or a crawler can read at any time with `moveAtomic()`. It writes the
  whole file in one step.
- Keep the cache, the sessions, the logs, the temporary files and the locks on the local disk.
  Use `core/lock` for a lock that all nodes must see.

To write to a folder that no mount covers, declare a mount in the `config.xml` of your module.
Declare only a folder that your module writes:

```xml
<config>
    <global>
        <storage>
            <mounts>
                <my_module_reports>
                    <dir>var</dir>
                    <path>my_module/reports</path>
                </my_module_reports>
            </mounts>
        </storage>
    </global>
</config>
```

`<dir>` is a folder that Maho knows, such as `var` or `media`. `<path>` is the folder below it.
An operator can then move this mount to a bucket in `local.xml`, like the core mounts.

A bucket is not a disk. Test your code on a bucket, because these operations change:

- `move()` is a copy and a delete.
- A deep `listContents()` returns files only, not folders.
- There are no locks, no seek and no partial reads.
