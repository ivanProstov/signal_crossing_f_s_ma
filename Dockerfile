# Используем официальный Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

COPY . .

RUN npm run build
#
## Запускаем приложение
CMD ["npm", "start"]

