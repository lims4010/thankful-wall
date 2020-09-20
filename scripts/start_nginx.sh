#!/bin/bash

echo `pwd`
sudo unlink /etc/nginx/sites-enabled/default
sudo cp /var/www/html/nginx2.conf /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/nginx2.conf /etc/nginx/sites-enabled/nginx2.conf
sudo nginx -t