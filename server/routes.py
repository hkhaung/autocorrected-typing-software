from flask import Blueprint, jsonify
from sqlalchemy import select, func
from server.data.models import Paragraphs
from server.extensions import db


api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/get_words_list', methods=['GET', 'OPTIONS'])
def get_words_list():
    with db.session.begin():
        stmt = select(Paragraphs.paragraph).order_by(func.random()).limit(1)
        result = db.session.execute(stmt).scalar()
        words_list = result.split(' ')
        return jsonify({"words": words_list})


@api_bp.route('/test', methods=['POST', 'OPTIONS'])
def test():
    return jsonify({'message': 'Hello world!'}), 200
