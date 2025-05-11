# Node Version
ARG NODE_VERSION=22

###############################
# STAGE 1 - BUILD CLIENT      #
###############################

# Portfolio Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as portfolio

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Before running npm ci, copy package files
COPY ./portfolio/package*.json ./
RUN npm ci --include=dev
COPY ./portfolio .

# Build the portfolio application
RUN npm run build

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

COPY ./server/package*.json ./
RUN npm ci --omit=dev
COPY ./server .

# Copy the built version of the portfolio into the image
COPY --from=portfolio /usr/src/app/dist ./public

# Make a directory for the database and make it writable
RUN mkdir -p ./data
RUN chown -R node:node ./data

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Command to check for a healthy application
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api || exit 1

# Run the application.
CMD npm run start