FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_SOCKET_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN rm -rf public/webviewer/lib \
  && mkdir -p public/webviewer/lib \
  && cp -R node_modules/@pdftron/webviewer/public/. public/webviewer/lib/

RUN npm run build


FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN npm install -g serve && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
