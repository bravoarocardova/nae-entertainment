FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose backend port
EXPOSE 4000

# Start server using tsx
CMD ["npx", "tsx", "src/server.ts"]
