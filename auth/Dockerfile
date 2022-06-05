FROM node:alpine

WORKDIR /app
COPY package.json .
# devdependency 설치 배제
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]

# docker build -t limkevin1313/auth .