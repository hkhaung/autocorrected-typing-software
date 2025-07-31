# Autocorrected Typing Software


Autocorrected Typing Software, or ATS, is a small full-stack web application that presents a typing interface for users to test their typing skills. It features WPM, accuracy, and autocorrect. Websockets are used to enable real-time, low-latency communication between the client (browser) and the server and to enable multiplayer (not yet implemented).


## How to run

You can run this in Docker.

After cloning this repo, run `cp .env.example .env`. This will create an `.env` file and update the values to your choice or leave as is:
```
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
MYSQL_HOST=ats-mysql-container
MYSQL_PORT=3306
```

Run `docker-compose up --build`. You only need to run this once; afterwards, you can just run `docker-compose up`.

Run `docker compose down` to stop containers, networks, and default volumes created by `docker-compose up`. Use `docker compose down -v` if you want to stop and remove.

The docker file is for production. 


## Development


To develop, docker file is not needed. Instead, you have to run the client and server separately in their respective terminal windows.

First, switch to the dev branch.

Note: the following is for Mac OS. Might differ a bit for Windows.

#### Server
Go into root directory. Make sure you have your virtual env setup for python:
```
python -m venv .venv
source .venv/bin/activate
```
Then run
`python -m server.app`

Server must be set up first.


#### Client

Go into client directory and run:
```
npm i
npm run dev
```