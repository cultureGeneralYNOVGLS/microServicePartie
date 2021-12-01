FROM bitnami/express:latest
USER root
COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "run start" ]