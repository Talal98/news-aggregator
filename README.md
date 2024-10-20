# News Aggregator

This is a frontend web application that aggregates news from various sources and displays them in a user-friendly, customizable interface. Users can search for news articles by keywords, filter by date, category, and source, and personalize their news feed based on preferred sources, categories, and authors. The app is fully mobile-responsive and containerized using Docker for easy deployment.

## Features

- **Article Search and Filtering**: Search for news articles by keyword, filter by date, category, and source.

- **Personalized News Feed**: Customize your feed by selecting preferred sources, categories, and authors.

- **Mobile-Responsive Design**: Optimized for mobile devices for a smooth user experience on any screen size.

## APIs Used

- NewsApi
- The Guardian
- The New York Times

## Steps To Run Using Docker

### Step 1: Clone the Repository

If you haven't already, clone the repository and change directory to it:

```
git clone https://github.com/Talal98/news-aggregator.git
```

```
cd news-aggregator
```

### Step 2: Build and Run the Docker Container

You should be in the root directory of the repo for this step.

Build the Docker image

```
docker build -t news-aggregator .
```

Run the Docker container

```
docker run -p 8080:80 news-aggregator
```

### Step 3: Access the Application

Once the container is running, open your web browser and navigate to:

http://localhost:8080

You should see the application running.
