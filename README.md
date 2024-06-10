# email-engine-core

## Overview

This project is a microservices architecture for an email client core system. It connects with Outlook, manages email data, and ensures scalability and performance.

## Services

### 1. User Service
Handles user management, including creating users and linking Outlook accounts.

### 2. Email Sync Service
Responsible for syncing emails from Outlook to the local database.

### 3. Email Data Service
Provides access to email data stored in the local database.

### 4. Notification Service
Handles sending notifications to users.

### 5. Elasticsearch
Used for storing and querying email data.

## What is this repository for?

    Stock Exchange Interface.

    Version:- 1.0
    Git clone :-https://github.com/debrajpaul/email-engine-core.git

## How do I get set up?

    Set up all dependencies mentioned below
    Summary of set up:- Clone the file from repository and follow the "deployment instructions".

## Prerequisites

   - Docker
   - Node.js
   - npm

## Dependencies

    All dependencies are listed in package.json file
    * In terminal go to your project directory
    * cd user-service
    * npm install
    * cd ../email-sync-service
    * npm install
    * cd ../email-data-service
    * npm install
    * cd ../notification-service
    * npm install
    * cd ..

## .env file
   Create a .env file in the root directory and add the following configurations:

```
# Common configuration
NODE_ENV=development

# Outlook configuration
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
OUTLOOK_REDIRECT_URI=http://localhost:3004/users/outlook-callback
OUTLOOK_BASE_URL=https://login.microsoftonline.com/common/oauth2/v2.0

# Elasticsearch configuration
ELASTICSEARCH_NODE=http://localhost:9200

```

## Deployment instructions:-

    In terminal go to your project directory
    * Build and start the services using Docker Compose:
    * docker-compose up --build

## UNIT TEST SUITE

    In terminal go to your project directory
    * Each service has its own set of unit tests. To run the tests:
    * cd user-service
    * npm test
    * cd ../email-sync-service
    * npm test
    * cd ../email-data-service
    * npm test
    * cd ../notification-service
    * npm test

## STOCK API DOCUMENTATION

    Go to your default browser or chrome & paste this URL
    * http://localhost:{pre-service-port}/swagger-ui/

## Who do I talk to?

    Debraj Paul
    contact info:- pauldebraj7@gmail.com
    LinkedIn:- https://www.linkedin.com/in/debraj-paul

## License

        Apache License