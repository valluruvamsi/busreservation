from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import config
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = list(db.bookings.find())
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def add_booking():
    booking_data = request.json
    result = db.bookings.insert_one(booking_data)
    booking_data['_id'] = str(result.inserted_id)
    return jsonify(booking_data)

@app.route('/api/bookings/<id>', methods=['PUT'])
def update_booking(id):
    booking_data = request.json
    db.bookings.update_one({'_id': ObjectId(id)}, {'$set': booking_data})
    booking_data['_id'] = id
    return jsonify(booking_data)

@app.route('/api/bookings/<id>', methods=['DELETE'])
def delete_booking(id):
    db.bookings.delete_one({'_id': ObjectId(id)})
    return jsonify({'result': 'Booking deleted'})

if __name__ == '__main__':
    app.run(debug=True)
