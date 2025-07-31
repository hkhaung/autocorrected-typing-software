#!/bin/bash


echo "Waiting for MySQL to be ready..."
while ! nc -z ats-mysql-container 3306; do
  echo "MySQL is not ready yet, waiting..."
  sleep 2
done


export FLASK_APP=server.app:create_app
export FLASK_ENV=production

echo "Starting Flask App with Gunicorn..."
exec gunicorn -k eventlet -w 1 -b 0.0.0.0:4000 --timeout 400 --access-logfile - --error-logfile - "server.app:create_app()"
