FROM node:23.3.0-alpine3.19

WORKDIR /usr/src/piles-calculator/

# Copy both package.json & package-lock.json
COPY package*.json ./
RUN npm install

# Copy source and build
COPY src/ /usr/src/piles-calculator/src/

RUN npm run build && npm link

EXPOSE 3040
CMD npm run serve
