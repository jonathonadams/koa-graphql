# -----------------------------------------
# Multi build file
# One for building our app and one for production
# -----------------------------------------
# -----------------------------------------
# Build container
# -----------------------------------------
# The build container is from the full node image for dependency installation
FROM node AS builder

# Create the app working directory
WORKDIR /usr/src/app

# Set the node environment to development
ENV NODE_ENV development

# Copy all files required for the build container to run
# Do not copy the source files here, every change will require a new npm install
COPY package.json package-lock.json tsconfig.json gulpfile.js /usr/src/app/

# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --only=dev --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

# Gulp does not currently install from npm install because of v4
# It needs to be installed it mannualy (issues with v4)
RUN npm install gulpjs/gulp#4.0 --no-save

# Copy the src files accross
COPY src src/

# Run the gulp build script using local gulp package
RUN npx gulp dist

# -----------------------------------------
# Production container
# -----------------------------------------
# Production image from the alpine image
FROM node:alpine AS production

# -----------------------------------------
# Install requirements for tesseract and image magick
# -----------------------------------------

# Create the app working directory
WORKDIR /usr/src/app

# Set the node environment to production
# This also means only prodcution npm's are installaed
ENV NODE_ENV production

# Copy accross all reqired files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install --only=prod --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

# Copy the distribution folder from the builder file
COPY --from=builder /usr/src/app/dist dist/

# Expost port 3000
# This port must match the port for the K8's continer health probe
# It must be exposed else the probe will fail
EXPOSE 3000

# Run the start command
CMD npm start
