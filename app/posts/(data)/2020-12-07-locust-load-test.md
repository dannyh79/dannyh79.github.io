---
title: 'Swarm Your Site with Locust'
createdAt: 2020-12-07 19:01:02 +0800
publishedAt: 2020-12-07
categories: [python, testing]
---

## TLDR

Locust, a Python load-testing framework, can help you set up load-tests like a breeze.

- Sets up complex UI interactions with ease
- Supports Docker for simulating real-world load

## How I Use It

For testing single engpoint request:

1. Gather stats of the sites' load distribution, i.e., Top Active Pages in Realtime, from Google Analytics
2. Based on the data, set up endpoints-of-interest and give each weight accordingly
3. Spin up Docker containers that matches the test criteria, i.e., 50 clients for C50

   ```sh
   $ docker-compose up --scale worker=50
   ```

4. Use Locust's web UI to start the test

## Example

- load_test.py

  ```python
  import time
  from locust import HttpUser, task, between

  class SomeUser(HttpUser):
      wait_time = between(1, 2)

      #  268 is the weight of the endpoint
      @task(268)
      def index(self):
          self.client.get("/")

      @task(264)
      def posts(self):
          self.client.get("/posts")

      @task(147)
      def about(self):
          self.client.get("/about")
  ```

- docker-compose.yml

  ```yaml
  version: '3'

  services:
    master:
      image: locustio/locust
      ports:
        - '8089:8089'
      volumes:
        - $PWD:/app
      command: -f /app/load_test.py --master -H http://master:8089

    worker:
      image: locustio/locust
      volumes:
        - $PWD:/app
      command: -f /app/load_test.py --worker --master-host master
  ```

## References

- [Locust](https://github.com/locustio/locust)
