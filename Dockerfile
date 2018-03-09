# Build
FROM node:9 AS build

COPY . /front
WORKDIR /front
RUN npm install && npm run build

# Production
FROM nginx:1.13.9

LABEL maintainer="Valentin GOT"
LABEL version="1.0.0"

COPY --from=build /front/tools/visual-management.conf /etc/nginx/conf.d/default.conf
COPY --from=build /front/dist /usr/share/nginx/html

EXPOSE 80
