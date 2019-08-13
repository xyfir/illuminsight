# Self-Host illuminsight

This tutorial is mainly targeted towards developers interested in working on illuminsight in a development environment.

# Step 0: Clone the Repo

First change to the directory where you wish to keep illuminsight.

```bash
git clone --recurse-submodules https://github.com/xyfir/illuminsight.git
cd illuminsight
```

From now on we'll assume commands are run from `illuminsight/`.

# Step 1: Install Dependencies

Install npm dependencies:

```bash
npm install
```

# Step 2: Set Environment Variables

illuminsight is configured via environment variables which are loaded via an `.env` file.

To understand the syntax of `.env` files, know that they are first loaded via [dotenv](https://www.npmjs.com/package/dotenv) and then the string values provided by dotenv are parsed by [enve](https://www.npmjs.com/package/enve).

First we'll copy the example file and then we'll update its values.

```bash
cp example.env .env
```

You can find the available environment variables in [types.d.ts](https://github.com/xyfir/illuminsight/blob/master/types.d.ts) in the `Illuminsight.Env` interface.

# Step 3: Build From Source

```bash
npm run build
```
