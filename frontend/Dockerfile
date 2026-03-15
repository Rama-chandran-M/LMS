# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Accept build argument from the pipeline
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV BACKEND_URL=http://localhost:3000

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
