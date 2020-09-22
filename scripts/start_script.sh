#!/bin/bash

cd /var/www/html/service_files

sudo cp app.service /etc/systemd/system

touch /var/www/html/service_files/appEnvVar.conf

mongoURI=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/mongoURI --query Parameters[0].Value)
jwtSecret=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/jwtSecret --query Parameters[0].Value)

echo "mongoURI=$mongoURI" > /var/www/html/service_files/appEnvVar.conf
echo "jwtSecret=$jwtSecret" >> /var/www/html/service_files/appEnvVar.conf

sudo systemctl daemon-reload
sudo systemctl reload-or-restart app


