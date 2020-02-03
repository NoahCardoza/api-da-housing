# Set base image
FROM node:12.13.1-alpine

# Set working directory
WORKDIR /home/node

# Add source code
COPY --chown=node:node . /home/node/

# Set unprivileged user
USER node

# Install dependencies
RUN npm install

# Set default run command
CMD node build/server.js