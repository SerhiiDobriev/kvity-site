FROM node:24-alpine
WORKDIR /app
COPY server.js ./
COPY public ./public
ENV DATA_DIR=/data HOST=0.0.0.0 PORT=4100 NODE_ENV=production
USER node
EXPOSE 4100
CMD ["node", "server.js"]
