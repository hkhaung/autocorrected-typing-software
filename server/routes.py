from flask import Blueprint, jsonify, request
from sqlalchemy import select, func
from server.data.models import Paragraphs
from server.extensions import db, socketio
from flask_socketio import emit
from server.typing_functionality.player_stats import wpm, accuracy

from datetime import datetime
import time
import threading

from server.typing_functionality.utils import lines_from_file, remove_punctuation, reformat, similar
from server.typing_functionality.autocorrect import autocorrect, subs, edit_distance, diff


api_bp = Blueprint('api', __name__, url_prefix='/api')

sessions = {}

WORDS_LIST = lines_from_file('server/data/words.txt')
WORDS_SET = set(WORDS_LIST)
LETTER_SETS = [(w, set(w)) for w in WORDS_LIST]
SIMILARITY_LIMIT = 2


@api_bp.route('/get_words_list', methods=['GET', 'OPTIONS'])
def get_words_list():
    with db.session.begin():
        stmt = select(Paragraphs.paragraph).order_by(func.random()).limit(1)
        result = db.session.execute(stmt).scalar()
        words_list = result.split(' ')
        return jsonify({"words": words_list})


# TODO: can be replaced with start_background_task?
def wpm_acc_updater(sid):
    MAX_DURATION = 300  # 5 mins

    while True:
        if not sid in sessions or sessions[sid].get("is_finished"):
            break

        session = sessions[sid]
        
        if session["start_time"] is None:
            time.sleep(0.5)
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
        socketio.start_background_task(wpm_acc_updater, sid)

    sessions[sid]['typed'] = typed


@socketio.on('finish_typing')
def finish_typing(data):
    sid = request.sid
    if sid in sessions and data.get('finished', False):
        socketio.emit("done", to=sid)
        socketio.emit("finish_typing", to=sid)


@api_bp.route('/autocorrect', methods=['POST', 'OPTIONS'])
def autocorrect_route():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
    curr_word = data.get('typed', '')

    if not curr_word or curr_word.isdigit():
        return jsonify({'corrected_word': curr_word})

    curr_word = curr_word.strip().split()[-1]
    curr_word_clean = remove_punctuation(curr_word).lower()
    if curr_word_clean in WORDS_SET or curr_word_clean == '':
        return jsonify({'corrected_word': curr_word})
    
    letters = set(curr_word_clean)
    candidates = [w for w, s in LETTER_SETS if similar(s, letters, SIMILARITY_LIMIT)]

    for func in [diff, subs, edit_distance]:
        try:
            guess = autocorrect(curr_word_clean, candidates, func, SIMILARITY_LIMIT)
            corrected_word = reformat(guess, curr_word)
            print("Correcting word from", curr_word, "to", corrected_word)
            return jsonify({'corrected_word': corrected_word})
        except BaseException:
            pass

    # was not able to correct, return original word
    print("Nothing was corrected")
    return jsonify({'corrected_word': curr_word})


@socketio.on('disconnect')
def disconnect():
    print(f"Disconnected: {request.sid}")
    sid = request.sid
    if sid in sessions:
        del sessions[sid]


@api_bp.route('/test', methods=['POST', 'OPTIONS'])
def test():
    return jsonify({'message': 'Hello world!'}), 200
