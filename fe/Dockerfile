FROM node:20-alpine AS builder

WORKDIR /app

# Define build arguments
ARG VITE_API_URL
ARG VITE_API_KEY
ARG VITE_YOUTUBE_API_KEY
ARG VITE_YOUTUBE_CHANNEL_ID
ARG VITE_YOUTUBE_USERNAME

# Set environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY
ENV VITE_YOUTUBE_CHANNEL_ID=$VITE_YOUTUBE_CHANNEL_ID
ENV VITE_YOUTUBE_USERNAME=$VITE_YOUTUBE_USERNAME

COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Use Nginx to serve the bundled production build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite default Nginx config to support React Router SPA (fallback to index.html)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
