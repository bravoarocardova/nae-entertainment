# NAE Entertainment - Landing Page

This is the official landing page for NAE Entertainment, a digital entertainment company. This project is a static website built with HTML and Tailwind CSS, and it is containerized using Docker for easy deployment and portability.

## Prerequisites

Before you begin, ensure you have [Docker](https://www.docker.com/get-started) installed on your local machine.

## Running the Project with Docker

Follow these steps to build the Docker image and run the container.

### 1. Build the Docker Image

Open your terminal or command prompt, navigate to the project's root directory (where the `Dockerfile` is located), and run the following command to build the Docker image. This command packages the website into an image named `nae-entertainment-web`.

```bash
docker build -t nae-entertainment-web .
```

### 2. Run the Docker Container

Once the image has been built successfully, run the following command to start a container from the image:

```bash
docker run -d -p 8080:80 nae-entertainment-web
```

**Command Breakdown:**
- `-d`: Runs the container in detached mode (in the background).
- `-p 8080:80`: Maps port 8080 on your host machine to port 80 inside the container. You can change `8080` to any other available port on your machine if needed.
- `nae-entertainment-web`: The name of the image to run.

### 3. Access the Website

After the container is running, you can access the website by opening your web browser and navigating to:

[http://localhost:8080](http://localhost:8080)

## Stopping the Container

To find the container ID and stop the running container, you can use the following commands:

```bash
# List all running containers to find the CONTAINER ID
docker ps

# Stop the container using its ID
docker stop <CONTAINER_ID>
```
