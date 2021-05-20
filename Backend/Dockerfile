FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

RUN echo "America/Cuiaba" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

EXPOSE 8008
CMD [ "npm", "start" ]









