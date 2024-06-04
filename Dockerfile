FROM node:latest as build

WORKDIR /app

COPY . .

RUN npm install


FROM node:20.14.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/public /app/public

COPY --from=build /app/src /app/src

COPY --from=build /app/package.json /app

CMD [ "npm", "start" ]





