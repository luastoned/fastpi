FROM node:20

# run everything inside /app directory
WORKDIR /app

# copy package.json
COPY package.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn --pure-lockfile --ignore-engines

# copy all other files
COPY . /app

# future docker versions won't need .dockerignore
# COPY --exclude=**/node_modules . /app

# build the app
RUN yarn build

# start the app
CMD ["yarn", "serve"]