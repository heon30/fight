FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json game.html ./
COPY app ./app
COPY server ./server
RUN mkdir -p /app/.realtime && chown node:node /app/.realtime
USER node
EXPOSE 10000
CMD ["node", "--no-warnings", "server/realtime.mjs"]
