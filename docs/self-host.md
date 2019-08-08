# Self-Host illuminsight

This tutorial will outline how to get illuminsight running on your own server.

# Requisites

- A Linux server (we'll use Ubuntu).
- Nginx or similar software installed to serve static files and act as a proxy.
- Let's Encrypt or similar geniune TLS (SSL) certificate (no self-signed certs!).
- Node.js installed on your server. We target the latest version available at time of the last [server/package.json](https://github.com/MrXyfir/illuminsight/blob/master/server/package.json) update.

# Step 0: Clone the Repo

First change to the directory where you wish to keep illuminsight.

```bash
git clone --recurse-submodules https://github.com/MrXyfir/illuminsight.git
cd illuminsight
```

From now on we'll assume commands are run from `illuminsight/`.

# Step 1: Install Dependencies

Install npm depencies for each module:

```bash
cd server
npm install
cd ../web
npm install
cd ../ # back to illuminsight/
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

If you get a libGL error during file conversion, you probably also need to run:

```bash
sudo apt install libgl1-mesa-glx
```

Finally, install Pandoc ([get latest](https://github.com/jgm/pandoc/releases/)):

```bash
# replace X.X.X with latest version
sudo wget https://github.com/jgm/pandoc/releases/download/X.X.X/pandoc-X.X.X-1-amd64.deb
sudo dpkg -i pandoc-X.X.X-1-amd64.deb
sudo rm pandoc-X.X.X-1-amd64.deb
```

# Step 2: Create Temp Directory

Now we need to create the temp directory where illuminsight will write temporary data to the disk. You can put it wherever and name it whatever you'd like, but for now we'll make it `temp/` alongside `illuminsight/`.

```bash
mkdir ../temp
```

# Step 3: Set Environment Variables

illuminsight is configured via environment variables which are loaded via `.env` files located in each subdirectory.

To understand the syntax of the `.env` files, know that they are first loaded via [dotenv](https://www.npmjs.com/package/dotenv) and then the string values provided by dotenv are parsed by [enve](https://www.npmjs.com/package/enve).

## Step 3a: Create `.env` Files

First we'll copy each example file and then we'll update their values.

```bash
cp server/example.env server/.env
cp web/example.env web/.env
```

## Step 3b: Configure

You can find the available environment variables in [types.d.ts](https://github.com/MrXyfir/illuminsight/blob/master/types.d.ts) under the `illuminsight.Env` namespace.

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
pm2 start --name illuminsight npm -- run start
cd ../
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
- Go to [Step 3](#step-3-set-environment-variables) to update any `.env` files that may require changes.
- Go to [Step 4](#step-4-build-from-source) to rebuild the apps.

Finally, restart the server:

```bash
pm2 restart illuminsight
```
