#!/bin/bash

sudo apt-get update
sudo curl https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
sudo apt-get install nginx -y
sudo apt-get install awscli -y
