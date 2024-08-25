git reset --hard
git pull
npm run build-prod
sudo rm -rf /var/www/herzenshunde-griechenland.de
sudo mkdir /var/www/herzenshunde-griechenland.de
sudo cp -r ./dist/browser/* /var/www/herzenshunde-griechenland.de
sudo cp ./.htaccess /var/www/herzenshunde-griechenland.de
