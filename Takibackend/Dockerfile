FROM node:10.16.3-alpine
RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . /app/backend

CMD ["npm", "start"]