FROM python:3.13-slim AS ats-backend

COPY server ./server
COPY ./client/dist ./server/build

RUN pip install -r server/requirements.txt
RUN pip install gunicorn pymysql

COPY boot.sh boot.sh
RUN chmod +x boot.sh

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
