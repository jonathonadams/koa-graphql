# Docker basics

## Docker build

Build a docker image from a Dockerfile

```
docker build -t <YOUR-IMAGE-NAME> .
```

`-t` image tag name, `.` specifies from the current director

e.g.

```
docker build -t api-server-image .
```

## Create a docker container

Create a docker container from an image.

```
docker create --name <YOUR-CONTAINER-NAME> -p 3000:3000 <YOUR-IMAGE-NAME>;
```

`--name` container name, `-p` map internal and external ports, `<YOUR-IMAGE-NAME>` specifies the image to create the container from.

Optional you can set environment variables, individually or from a file.

```
docker create --name <YOUR-CONTAINER-NAME> -p 3000:3000 --env-file .env <YOUR-IMAGE-NAME>;
```

`--env-file` environment file name.

e.g.

```
docker create --name api-server-container --env-file .env -p 3000:3000 api-server-image;
```

## Docker commands

`docker start` Start a docker container

```
docker start <YOUR-CONTAINER-NAME>
```

## Create a network

`docker network` Create a docker network.

```
docker network <NETWORK-NAME>
```

`docker network rm` remove a docker network.

```
docker network rm <NETWORK-NAME>
```

e.g.

```
docker network create proxy
docker network create internal
docker network rm proxy
```

## Development Local Mongo Container

Configuring a database can be difficult and time consuming. You can avoid this by running your database in a local docker container.

NOTE: A word of warning, if your delete your container instance all data will be lost. Containers are ephemeral. To help mitigate this during development use `docker create` then `docker start / stop`. The container will not be destroyed until you remove it.

Make sure to map the port so that it is available outside of the docker environment.

```bash
docker create \
  --name local-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongo \
  -e MONGO_INITDB_ROOT_PASSWORD=mongo_password \
mongo
```

Note: If the mongo image has not previously been downloaded, the `docker create` command will pull the image for you. Alternatively you can run `docker pull mongo` to manually download the image before your run `docker create`

This will create a container called `local-mongo` from the `mongo` image.

Start the container

```
docker start local-mongo
```

Once the container is running, you can exec into the container terminal (and mongo) by running the `docker exec` and run all your command line commands.

```bash
docker exec -ti local-mongo bash
```

To leave the container, just type `exit`

Stop the container

```
docker stop local-mongo
```

Read more about Mongo and Docker and how to configure it [here](https://hub.docker.com/_/mongo)

## Development Local Postgres Container (Archived)

Create the container

```bash
docker create \
  --name local-postgres \
  -p 5432:5432 \
postgres
```

exec into the running container

```
docker exec -ti local-postgres bash
```

Log into postgres

```
psql -U postgres
```

The username is **postgres** because we did not specify a **POSTGRES_USER** environment variable when the container was created.

Read more about Postgres and Docker and how to configure it [here](https://hub.docker.com/_/postgres/).

## Local Redis Server

Redis can be used in many ways, but the easiest way to get up and running locally is with [docker redis](https://hub.docker.com/_/redis).

```
docker pull redis

docker create --name redis -p 6379:6379 reds

docker start redis
```
