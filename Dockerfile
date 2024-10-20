# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock files to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the app's source code to the container
COPY . .

# Build the app for production
RUN yarn build

# Stage 2: Serve the React app using a static file server
FROM nginx:stable-alpine

# Copy the build output from the previous stage to the NGINX public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port on which NGINX will serve the app
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
