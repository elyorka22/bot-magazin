# Многоэтапная сборка для Next.js приложения
FROM node:18-alpine AS web-builder

WORKDIR /app

# Копируем файлы package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь исходный код (кроме того, что исключено в .dockerignore)
COPY . .

# Собираем Next.js приложение
RUN npm run build:web

# Продакшн образ для веб-приложения
FROM node:18-alpine AS web-production

WORKDIR /app

# Копируем package.json и устанавливаем только продакшн зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем собранное приложение
COPY --from=web-builder /app/.next ./.next
COPY --from=web-builder /app/public ./public
COPY --from=web-builder /app/next.config.js ./

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"] 