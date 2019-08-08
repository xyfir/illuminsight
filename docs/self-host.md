# Self-Host illuminsight

This tutorial will outline how to get illuminsight running on your own server.

# Requisites

- A Linux server (we'll use Ubuntu).
- Nginx or similar software installed to serve static files and act as a proxy.
- Node.js installed on your server. We target the latest version available at time of the last [server/package.json](https://github.com/MrXyfir/illuminsight/blob/master/server/package.json) update.

# Step 0: Clone the Repo

First change to the directory where you wish to keep illuminsight.

```bash
git clone --recurse-submodules https://github.com/MrXyfir/illuminsight.git
cd illuminsight
```

From now on we'll assume commands are run from `illuminsight/`.

# Step 1: Install Dependencies

Install npm dependencies:

```bash
npm install
```

While not required, we'll use pm2 for this tutorial, so install it to manage our server:

```bash
npm install -g pm2
```

# Step 2: Set Environment Variables

illuminsight is configured via environment variables which are loaded via an `.env` file.

To understand the syntax of `.env` files, know that they are first loaded via [dotenv](https://www.npmjs.com/package/dotenv) and then the string values provided by dotenv are parsed by [enve](https://www.npmjs.com/package/enve).

First we'll copy the example file and then we'll update its values.

```bash
cp example.env .env
```

You can find the available environment variables in [types.d.ts](https://github.com/MrXyfir/illuminsight/blob/master/types.d.ts) in the `illuminsight.Env` interface.

# Step 3: Build From Source

```bash
npm run build
```

# Step 4: Start Server

Last but not least, start the server with pm2, which you should have installed earlier:

```bash
pm2 start --name illuminsight npm -- run start
pm2 startup # then follow instructions
```

# Upgrading illuminsight

This is a general guide for upgrading from one version of illuminsight to another. It's possible there are more specific steps you'll have to follow based on your current version and that of which you wish to upgrade to, but these steps should typically get you at least 90% of the way there.

To begin the process of upgrading illuminsight, let's first reset the repo and pull in changes:

```bash
git reset --hard origin/master
git pull
```

Now we'll once again run through some of the steps above:

- Go to [Step 1](#step-1-install-dependencies) to update dependencies.
- Go to [Step 3](#step-2-set-environment-variables) to update any `.env` files that may require changes.
- Go to [Step 4](#step-3-build-from-source) to rebuild the apps.

Finally, restart the server:

```bash
pm2 restart illuminsight
```
