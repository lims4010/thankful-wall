#!/bin/bash

cd /var/www/html/service_files

sudo cp app.service /etc/systemd/system

sudo systemctl daemon-reload
sudo systemctl start app


