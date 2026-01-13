FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create a symlink to the shared APK file in the public directory
# This allows the file to be served by the development server
RUN ln -sf /shared/client.apk public/client.apk

EXPOSE 8081

CMD ["npm", "start"]
