FROM node:18-alpine
WORKDIR /usr/src/app

# Copy toàn bộ code
COPY . .

# Cài express
RUN npm install express

# Mở port 3000
EXPOSE 3000

# Chạy server
CMD ["node", "server.js"]
