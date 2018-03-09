<h1 align="center">Visual Management</h1>

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

`docker-compose up -d` will automatically deploy the 3 required parts of the application:

* The front-end app
* The server
* The MongoDB database

Then, just go to `http://localhost:8080`, and here it works.

# Plugins

All plugins are installed by default. The full list can be found [here](/plugins/README.md).
