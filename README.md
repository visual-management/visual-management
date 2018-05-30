<h1 align="center">Visual Management</h1>

<p align="center">
  <img alt="Visual Management" src="/assets/example.png" height="450px" />
</p>

<p align="center">
  <a href="https://visual-management.github.io/visual-management/"><strong>Documentation</strong></a>
</p>

---

# Deploy using Docker

### Build the images

Front image:

```sh
docker build -t visual-management-front:latest .
```

Server image:

```sh
cd plugins/visual-management-server
docker build -t visual-management-server:latest .
```

### Run the application

> Before, you need to create the `/opt/visual-management/db` folder

`docker-compose up -d` will automatically deploy the 3 required parts of the application:

* The front-end app
* The server
* The MongoDB database

Then, just go to `http://localhost:8080`, and here it works.

# Plugins

All plugins are installed by default. The full list can be found [here](/plugins/README.md).

# Development

```sh
# Launch a MongoDB database
# e.g using Docker
docker run \
  -p 27017:27017 \
 --mount type=bind,source=/opt/visual-management/db,destination=/data/db \
  --env MONGO_DATA_DIR=/data/db \
  --name visual-management-mongo \
  mongo:3.7.2

# Launch the front-end app
npm start

# Launch the server
cd plugins/visual-management-server
npm start
```
