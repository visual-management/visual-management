FROM node:9

COPY . /server
WORKDIR /server
RUN npm install

LABEL maintainer="Valentin GOT"
LABEL version="1.0.0"

EXPOSE 9090

ENV NODE_ENV production
CMD [ "node", "index.js" ]
