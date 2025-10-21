FROM node:lts-slim as build
WORKDIR /src
RUN npm install -g @angular/cli
COPY . ./
RUN npm ci
RUN ng build --configuration=production

FROM nginx:stable AS final
EXPOSE 80
COPY --from=build src/dist/angular-app/browser  /usr/share/nginx/html


