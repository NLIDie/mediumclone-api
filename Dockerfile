FROM node:16.13

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
entrypoint "/entrypoint.sh"
