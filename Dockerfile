# Use official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the port your Node app runs on
EXPOSE 3000

# Start the Node app
CMD ["npm", "start"]
