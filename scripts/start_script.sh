#!/bin/bash

export mongoURI=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/mongoURI --query Parameters[0].Value)
export jwtSecret=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/jwtSecret --query Parameters[0].Value)

cd /var/www/html/
pm2 start server.js

# # Copy service file to main sytem
# cd /var/www/html/service_files
# sudo cp app.service /etc/systemd/system

# # Set env variables for service file
# touch /etc/systemd/system/appEnvVar.conf

# mongoURI=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/mongoURI --query Parameters[0].Value)
# jwtSecret=$(aws ssm get-parameters --region us-east-1 --names /thankful-wall/jwtSecret --query Parameters[0].Value)

# echo "mongoURI=$mongoURI" > /etc/systemd/system/appEnvVar.conf
# echo "jwtSecret=$jwtSecret" >> /etc/systemd/system/appEnvVar.conf

# # Reload/Start service
# sudo systemctl daemon-reload
# sudo systemctl reload-or-restart app


