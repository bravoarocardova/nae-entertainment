# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the static assets to the Nginx web root directory
COPY index.html /usr/share/nginx/html

# Expose port 80 to allow traffic to the web server
EXPOSE 80

# The default command for the nginx image will start the server.
# CMD ["nginx", "-g", "daemon off;"]
