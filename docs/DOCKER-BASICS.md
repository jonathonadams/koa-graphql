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
docker network rem <NETWORK-NAME>
```

e.g.

```
docker network create proxy
docker network create internal
docker network rm proxy
```

## Development Local Postgres Container

How to create a local postgres container for development
Configuring postgres can be difficult and time consuming. You can avoid this by running postgres in a local docker container.

NOTE: A word of warning, if your delete your postgres instance all data will be lost. Containers are ephemeral. To help mitigate this during development use `docker create` then `docker start / stop`. The container will not be destroyed until you remove it.

Make sure to map the port so that it is available outside of the docker environment.

Create the container

```
docker create --name local-postgres -p 5432:5432 postgres
```

Start the container

```
docker start local-postgres
```

Stop the container.=

```
docker stop local-postgres
```

Once the container is running, you can exec into the container (and postgres) by running `docker exec`

```
docker exec -ti local-postgres bash
```

Log into postgres

```
psql -U postgres
```

The username is **postgres** because we did not specify a **POSTGRES_USER** environment variable when the container was created.

Read more about Postgres and Docker and how to configure it [here](https://hub.docker.com/_/postgres/).

Note: If the postgres image has not previously been downloaded, the `docker create` command will pull the image for you. Alternatively you can run `docker pull postgres` or `docker pull postgres:alpine` to manually download the image before your run `docker create`
