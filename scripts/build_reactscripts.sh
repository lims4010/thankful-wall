#!/bin/bash

## Build static files to serve via react scripts
cd /var/www/html/
cd pages && npm install && npm run build
cd .. && npm install