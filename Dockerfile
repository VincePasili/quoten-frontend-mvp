# Dockerfile for React Frontend
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight server to serve the build
FROM nginx:alpine
# Copy nginx config file
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port that Nginx serves
EXPOSE 80

# Nginx runs by default
CMD ["nginx", "-g", "daemon off;"]
