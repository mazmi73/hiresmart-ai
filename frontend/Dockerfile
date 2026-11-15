# Stage 1: Build Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm install

# Copy application sources and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx Alpine
FROM nginx:alpine

# Copy built Angular files to Nginx web root
COPY --from=build /app/dist/hiresmart-frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback and API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
