# Setup Insightful

This tutorial will outline how to get Insightful running on your own server.

# Requisites

- A Linux server (we'll use Ubuntu).
- Nginx or similar software installed to serve static files and act as a proxy.
- Let's Encrypt or similar geniune TLS (SSL) certificate (no self-signed certs!).
- Node.js installed on your server. We target the latest version available at time of the last [server/package.json](https://github.com/MrXyfir/insightful/blob/master/server/package.json) update.

# Step 0: Clone the Repo

First change to the directory where you wish to keep Insightful.

```bash
git clone --recurse-submodules https://github.com/MrXyfir/insightful.git
cd insightful
```

From now on we'll assume commands are run from `insightful/`.

# Step 1: Install Dependencies

Install npm depencies for each module:

```bash
cd server
npm install
cd ../web
npm install
cd ../ # back to insightful/
```

While not required, we'll use pm2 for this tutorial, so install it to manage our API server:

```bash
npm install -g pm2
```

Next, install Calibre:

```bash
# ignore "Setting up desktop integration" error
sudo -v && wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin
```

Finally, install Pandoc ([get latest](https://github.com/jgm/pandoc/releases/)):

```bash
# replace X.X.X with latest version
sudo wget https://github.com/jgm/pandoc/releases/download/X.X.X/pandoc-X.X.X-1-amd64.deb
sudo dpkg -i pandoc-X.X.X-1-amd64.deb
sudo rm pandoc-X.X.X-1-amd64.deb
```

# Step 2: Create Temp Directory

Now we need to create the temp directory where Insightful will write temporary data to the disk. You can put it wherever and name it whatever you'd like, but for now we'll make it `temp/` alongside `insightful/`.

```bash
mkdir ../temp
```

# Step 3: Set Environment Variables

Insightful is configured via environment variables which are loaded via `.env` files located in each subdirectory.

To understand the syntax of the `.env` files, know that they are first loaded via [dotenv](https://www.npmjs.com/package/dotenv) and then the string values provided by dotenv are parsed by [enve](https://www.npmjs.com/package/enve).

## Step 3a: Create `.env` Files

First we'll create each file and then we'll work our way through populating them with values.

```bash
touch server/.env web/.env
```

## Step 3b: Configure

You can find the available environment variables in [types/insightful.d.ts](https://github.com/MrXyfir/insightful/blob/master/types/insightful.d.ts) under the `Insightful.Env` namespace.

# Step 4: Build From Source

```bash
cd server
npm run build
cd ../web
npm run build
cd ../
```

# Step 5: Start Server

Last but not least, start the server with pm2, which you should have installed earlier:

```bash
cd server
pm2 start --name insightful npm -- run start
cd ../
pm2 startup # then follow instructions
```

# Upgrading Insightful

This is a general guide for upgrading from one version of Insightful to another. It's possible there are more specific steps you'll have to follow based on your current version and that of which you wish to upgrade to, but these steps should typically get you at least 90% of the way there.

To begin the process of upgrading Insightful, let's first reset the repo and pull in changes:

```bash
git reset --hard origin/master
git pull
```

Now we'll once again run through some of the steps above:

- Go to [Step 1](#step-1-install-dependencies) to update dependencies.
- Go to [Step 3](#step-3-set-environment-variables) to update any `.env` files that may require changes.
- Go to [Step 4](#step-4-build-from-source) to rebuild the apps.

Finally, restart the servers:

```bash
pm2 restart all
```
