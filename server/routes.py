from flask import Blueprint, jsonify, request


api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/test', methods=['POST', 'OPTIONS'])
def test():
    return jsonify({'message': 'Hello world!'}), 200
