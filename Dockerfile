FROM mhart/alpine-node

WORKDIR /app

EXPOSE 3100

ADD . /app

RUN yarn --silent
