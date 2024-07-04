from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.bus_reservation

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = list(db.bookings.find({}))
    for booking in bookings:
        booking['_id'] = str(booking['_id'])  # Convert ObjectId to string
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    result = db.bookings.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

@app.route('/api/bookings/<id>', methods=['PUT'])
def update_booking(id):
    data = request.json
    db.bookings.update_one({'_id': ObjectId(id)}, {'$set': data})
    return jsonify({"message": "Booking updated"}), 200

if __name__ == '__main__':
    app.run(debug=True)
@app.route('/api/bookings/<id>', methods=['DELETE'])
def delete_booking(id):
    db.bookings.delete_one({'_id': ObjectId(id)})
    return jsonify({"message": "Booking deleted"}), 200
