FROM node:16.3.0-alpine

# create app directory
RUN mkdir -p /usr/app
RUN chmod -R 777 /usr/app
WORKDIR /usr/app

# copy all files to container
COPY . .

# install app dependencies
COPY package*.json ./
RUN npm install --silent

# set environments
ENV NODE_ENV prod

# create build files to production
RUN npm run build

# RUN npm run start:docker