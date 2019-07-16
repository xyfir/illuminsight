if [ "$PACKAGE" == "server" ]; then
  sudo -v && wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin
  sudo wget https://github.com/jgm/pandoc/releases/download/2.7.3/pandoc-2.7.3-1-amd64.deb
  sudo dpkg -i pandoc-2.7.3-1-amd64.deb
  sudo rm pandoc-2.7.3-1-amd64.deb
  sudo sudo apt install -y libgl1-mesa-glx
fi

if [ "$PACKAGE" != "." ]; then
  cp example.env .env
  npm t
  npm run build
fi