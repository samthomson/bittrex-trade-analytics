FROM mhart/alpine-node

WORKDIR /app

EXPOSE 3100

ADD . /app

RUN yarn --silent

# RUN yarn global add ts-node --silent

# RUN yarn build

# CMD yarn start