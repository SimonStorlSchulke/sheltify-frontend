npm run build-prod
sudo rm -rf /var/www/dev.herzenshunde-griechenland.de
sudo mkdir /var/www/dev.herzenshunde-griechenland.de
sudo cp -r ./doc/browser/* /var/www/dev.herzenshunde-griechenland.de
sudo cp ./.htaccess /var/www/dev.herzenshunde-griechenland.de