FROM node:alpine3.18 AS base
LABEL version="1.0"
LABEL author="Galitan-dev"
WORKDIR /run

FROM base AS dependencies
ADD server/package.json package.json
RUN [ "npm", "install" ]

FROM dependencies AS build
ADD server/src src
ADD server/tsconfig.json tsconfig.json
RUN [ "npm", "run", "build"]

FROM dependencies AS prod
COPY --from=build dist dist
ENTRYPOINT [ "/usr/local/bin/npm" ]
CMD [ "start" ]