FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]