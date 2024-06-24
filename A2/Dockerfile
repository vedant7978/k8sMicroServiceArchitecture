FROM node:latest

ENV DATABASE_URL ${DATABASE_URL}

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install -g prisma

COPY . .

# RUN prisma generate

EXPOSE 8080

CMD ["node","index.js"]
