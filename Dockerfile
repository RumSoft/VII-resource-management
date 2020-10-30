# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:10 AS builder
# Set working directory
WORKDIR /
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm install && npm run build

# # nginx state for serving content
# FROM nginx:alpine
# # Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html
# # Remove default nginx static assets
# RUN rm -rf ./*
# # Copy static assets from builder stage
# COPY --from=builder /build .
# # Containers run nginx with global directives and daemon off
# ENTRYPOINT ["nginx", "-g", "daemon off;"]


FROM steebchen/nginx-spa:stable

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]