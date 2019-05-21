FROM node:10
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY . /app
CMD node index.js
EXPOSE 3009