FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p public/webviewer/lib \
  && cp -R node_modules/@pdftron/webviewer/public/. public/webviewer/lib/

EXPOSE 5173

CMD ["sh", "-c", "mkdir -p public/webviewer/lib && cp -R node_modules/@pdftron/webviewer/public/. public/webviewer/lib/ && npm run dev -- --host 0.0.0.0"]