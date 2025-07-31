FROM node:21-alpine AS frontend-build

WORKDIR /app

COPY client/ ./client
WORKDIR /app/client

RUN npm install
RUN npm run build


FROM python:3.13-slim AS ats-backend

COPY server ./server
# COPY ./client/dist ./server/build
COPY --from=frontend-build /app/client/dist ./server/build

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN pip install gunicorn pymysql

# Install netcat for waiting on MySQL
RUN apt-get update && apt-get install -y netcat-openbsd

COPY boot.sh boot.sh
RUN chmod +x boot.sh

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
