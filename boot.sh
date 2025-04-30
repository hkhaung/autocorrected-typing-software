#!/bin/bash


echo "Running Flask Migrations..."
if [ ! -d "/migrations" ]; then
    echo "Migrations folder not found. Initializing..."
    flask db init
fi

while true; do
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done

echo "Starting Flask App with Gunicorn..."
exec gunicorn -b :5000 --timeout 400 -w 4 --access-logfile - --error-logfile - "server.app:create_app()"

# to view logs
# docker logs -f <container_name_or_id>
