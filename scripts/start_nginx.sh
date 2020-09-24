#!/bin/bash

### Configure certificates
# sudo unlink /etc/nginx/sites-enabled/default
# sudo cp /var/www/html/nginx_init.conf /etc/nginx/sites-available
# sudo ln -s /etc/nginx/sites-available/nginx_init.conf /etc/nginx/sites-enabled/nginx_init.conf
# sudo service nginx restart
# sudo certbot run -n --nginx --agree-tos -d thankful-wall.com,www.thankful-wall.com  -m  lims4011@gmail.com  --redirect

### Reload Nginx
# sudo unlink /etc/nginx/sites-enabled/nginx_init.conf
# sudo cp /var/www/html/nginx.conf /etc/nginx/sites-available
# sudo ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf
# sudo service nginx restart
# sudo nginx -t