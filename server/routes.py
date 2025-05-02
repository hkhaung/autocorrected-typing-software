import socket
from flask import Blueprint, jsonify, request
from sqlalchemy import select, func
from server.data.models import Paragraphs
from server.extensions import db, socketio
from flask_socketio import emit
from server.typing_functionality.player_stats import wpm, accuracy

from datetime import datetime
import time
import threading


api_bp = Blueprint('api', __name__, url_prefix='/api')

sessions = {}


@api_bp.route('/get_words_list', methods=['GET', 'OPTIONS'])
def get_words_list():
    with db.session.begin():
        stmt = select(Paragraphs.paragraph).order_by(func.random()).limit(1)
        result = db.session.execute(stmt).scalar()
        words_list = result.split(' ')
        return jsonify({"words": words_list})


def wpm_acc_updater(sid):
    MAX_DURATION = 300  # 5 mins

    while True:
        if not sid in sessions or sessions[sid].get("is_finished"):
            break

        session = sessions[sid]
        
        if session["start_time"] is None:
            continue

        elapsed = (datetime.now() - session["start_time"]).total_seconds()
        if elapsed >= MAX_DURATION:
            sessions[sid]["is_finished"] = True
            socketio.emit('timeout', {'message': 'Session timed out after 5 minutes.'}, to=sid)
            break

        typed = session["typed"]
        user_wpm = wpm(typed, elapsed)
        user_acc = accuracy(typed, session["words_list"])
        socketio.emit('wpm_acc_update', {'wpm': user_wpm, 'acc': user_acc}, to=sid)
        
        time.sleep(1)


@socketio.on('start_typing')
def start_typing(data):
    sid = request.sid
    words_list = data.get('wordsList', [])
    typed = data.get('typed', '')

    if sid not in sessions:
        sessions[sid] = {
            'start_time': None,
            'words_list': words_list,
            'typed': typed,
            'is_finished': False
        }
    
    if sessions[sid]["start_time"] is None and typed:
        sessions[sid]["start_time"] = datetime.now()
        threading.Thread(target=wpm_acc_updater, args=(sid,), daemon=True).start()

    sessions[sid]['typed'] = typed


@socketio.on('finish_typing')
def finish_typing(data):
    sid = request.sid
    if sid in sessions and data.get('finished', False):
        socketio.emit("done", to=sid)
        socketio.emit("finish_typing", to=sid)


@socketio.on('disconnect')
def disconnect():
    print(f"Disconnected: {request.sid}")
    sid = request.sid
    if sid in sessions:
        del sessions[sid] 


@api_bp.route('/test', methods=['POST', 'OPTIONS'])
def test():
    return jsonify({'message': 'Hello world!'}), 200
