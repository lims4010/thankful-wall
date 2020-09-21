#!/bin/bash

cd /var/www/html/service_files

sudo cp app.service /etc/systemd/system

export mongoURI= aws ssm get-parameters --region us-east-1 --names /thankful-wall/mongoURI --query Parameters[0].Value
export jwtSecret= aws ssm get-parameters --region us-east-1 --names /thankful-wall/jwtSecret --query Parameters[0].Value

sudo systemctl daemon-reload
sudo systemctl start app


