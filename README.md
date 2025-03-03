# Thankful Wall

A web application for sharing gratitude posts.

## Docker Setup for API Server

This repository contains the API server for the Thankful Wall application. Static assets are served separately.

### Prerequisites

- Docker and Docker Compose installed on your system
- AWS credentials with access to DynamoDB
- Auth0 account configured for authentication

### Running with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/thankful-wall.git
   cd thankful-wall
   ```

2. Configure your environment variables:

   The Docker Compose setup uses the `.env` file in the `server` directory. Make sure this file exists and contains all necessary environment variables:

   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AUTH0_DOMAIN=your_auth0_domain
   AUTH0_AUDIENCE=your_auth0_audience
   AUTH0_CLIENT_ID=your_auth0_client_id
   ```

   You can also override or add additional environment variables in the `docker-compose.yml` file if needed.

3. Build and start the container:
   ```bash
   docker-compose up -d
   ```

4. The API will be available at http://localhost:5001

### Building the Docker Image Manually

If you prefer to build and run the Docker image without Docker Compose:

1. Build the image:
   ```bash
   docker build -t thankful-wall-api .
   ```

2. Run the container using environment variables from your .env file:
   ```bash
   docker run -p 5001:5001 \
     --env-file ./server/.env \
     -e NODE_ENV=production \
     -e CORS_ORIGIN=* \
     -d thankful-wall-api
   ```

## Deploying React Frontend to S3

This repository includes a script to build and deploy the React frontend to an Amazon S3 bucket.

### Prerequisites for S3 Deployment

- AWS CLI installed and configured with appropriate permissions
- An AWS account with an S3 bucket already set up for static website hosting
- Node.js installed

### S3 Bucket Setup (One-time)

Before using the deployment script, you need to set up your S3 bucket for static website hosting:

1. Create an S3 bucket with a unique name
2. Enable static website hosting on the bucket
3. Set the index document to `index.html` and error document to `index.html`
4. Configure bucket permissions to allow public read access
5. (Optional) Set up CloudFront for HTTPS and better performance

### Deployment Process

1. Make the script executable (if not already):
   ```bash
   chmod +x deploy-to-s3.js
   ```

2. Run the script with your S3 bucket name:
   ```bash
   ./deploy-to-s3.js your-bucket-name [aws-profile] [aws-region] [cloudfront-distribution-id]
   ```
   
   Or:
   ```bash
   node deploy-to-s3.js your-bucket-name [aws-profile] [aws-region] [cloudfront-distribution-id]
   ```

### What the Deployment Script Does

1. Checks if the specified S3 bucket exists
2. Builds the React application
3. Uploads the build files to S3 with appropriate cache settings:
   - Static assets (JS, CSS, images) with long cache duration
   - HTML and manifest files with no-cache settings
4. Invalidates CloudFront cache if a distribution ID is provided
5. Displays the URL where your website is accessible

## Development Setup

### API Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or update your `.env` file with your environment variables:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AUTH0_DOMAIN=your_auth0_domain
   AUTH0_AUDIENCE=your_auth0_audience
   AUTH0_CLIENT_ID=your_auth0_client_id
   CORS_ORIGIN=*
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Client Development

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- RESTful API for post management
- Pagination with cursor-based implementation
- In-memory post limits (3 posts per IP address within 24 hours)
- Authentication with Auth0
- Like/unlike posts functionality
- DynamoDB for data storage
- CORS enabled for cross-origin requests
