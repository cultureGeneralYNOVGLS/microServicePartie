FROM bitnami/express:latest
COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "run start" ]