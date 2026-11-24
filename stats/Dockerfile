FROM node:24-alpine
WORKDIR /app
COPY server.js ./
COPY public ./public
ENV DATA_DIR=/data HOST=0.0.0.0 PORT=4200 NODE_ENV=production
USER node
EXPOSE 4200
CMD ["node", "server.js"]
