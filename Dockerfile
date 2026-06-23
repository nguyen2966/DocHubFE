FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p public/lib/webviewer \
  && cp -R node_modules/@pdftron/webviewer/public/. public/lib/webviewer/

EXPOSE 5173

CMD ["sh", "-c", "mkdir -p public/lib/webviewer && cp -R node_modules/@pdftron/webviewer/public/. public/lib/webviewer/ && npm run dev -- --host 0.0.0.0"]