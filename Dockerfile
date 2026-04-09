FROM node:22-alpine

WORKDIR /app

# Copy manifests first for layer caching
COPY package*.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]
