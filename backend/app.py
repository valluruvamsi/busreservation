from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.bus_reservation

@app.route('/api/buses', methods=['GET'])
def get_buses():
    buses = list(db.buses.find({}))
    return jsonify(buses)

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = list(db.bookings.find({}))
    return jsonify(bookings)

@app.route('/api/bookings', methods=['POST'])
def add_booking():
    data = request.json
    booking_id = db.bookings.insert_one(data).inserted_id
    return jsonify({"message": "Booking successful", "_id": str(booking_id)}), 201

@app.route('/api/bookings/<id>', methods=['PUT'])
def update_booking(id):
    data = request.json
    db.bookings.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Booking updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
