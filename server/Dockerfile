FROM node:alpine3.18 AS base
LABEL version="1.0"
LABEL author="Galitan-dev"
WORKDIR /run

FROM base AS dependencies
ADD package.json package.json
RUN [ "npm", "install" ]

FROM dependencies AS build
ADD src src
ADD tsconfig.json tsconfig.json
RUN [ "npm", "run", "build"]

FROM dependencies AS prod
COPY --from=build /run/dist /run
ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "/run/index.js" ]