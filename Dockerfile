FROM node:latest as build

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY /src /app/src

COPY /public/ /app/public

COPY /logs /app/logs

FROM node:20.14.0-alpine

WORKDIR /app

# RUN groupadd -r dockeruser && useradd --no-log-init -r -g dockeruser dockeruser
RUN addgroup -S dockeruser && adduser -S -G dockeruser dockeruser

USER dockeruser

COPY --chown=dockeruser:dockeruser --from=build /app/node_modules /app/node_modules

COPY --chown=dockeruser:dockeruser --from=build /app/public /app/public

COPY --chown=dockeruser:dockeruser --from=build /app/src /app/src

COPY --chown=dockeruser:dockeruser --from=build /app/package.json /app

COPY --chown=dockeruser:dockeruser --from=build /app/logs /app/logs

CMD [ "npm", "start" ]



