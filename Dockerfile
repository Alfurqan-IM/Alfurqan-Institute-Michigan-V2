# Use Node.js LTS version
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files separately (to use Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma Client (IMPORTANT)
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:dev"]
