# Build instructions for reviewers

These instructions reproduce the submitted extension from the provided source code package.

## Prerequisites

- Deno 2.x
- Docker Desktop or Docker Engine running

## Build

From the root of the extracted source package, run:

```sh
deno install --frozen
deno task archive
```

This command builds the production versions of the extension and creates the release archives.

The generated Firefox extension is written to:

```
release/bonjourr-firefox-22.2.1.zip
```

The unpacked Firefox build is available in:

```
release/firefox/
```

No manual modifications are made after the build completes.