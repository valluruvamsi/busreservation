import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './RedBusComponent.css';

const cities = [
  'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'
];

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : cities.filter(
    city => city.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const RedBusComponent = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleBookTicket = () => {
    const newBooking = { from, to, date };
    if (editIndex !== null) {
      const bookingId = bookings[editIndex]._id;
      axios.put(`http://localhost:5000/api/bookings/${bookingId}`, newBooking)
        .then(response => {
          const updatedBookings = bookings.map((booking, index) =>
            index === editIndex ? { ...newBooking, _id: bookingId } : booking
          );
          setBookings(updatedBookings);
          setEditIndex(null);
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/api/bookings', newBooking)
        .then(response => setBookings([...bookings, { ...newBooking, _id: response.data._id }]))
        .catch(error => console.error(error));
    }
    setFrom('');
    setTo('');
    setDate('');
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const booking = bookings[index];
    setFrom(booking.from);
    setTo(booking.to);
    setDate(booking.date);
  };

  const handleCompleteJourney = (id) => {
    console.log("Deleting booking with ID:", id);  // Debugging log
    axios.delete(`http://localhost:5000/api/bookings/${id}`)
      .then(response => {
        console.log("Deletion response:", response.data);  // Debugging log
        const updatedBookings = bookings.filter(booking => booking._id !== id);
        setBookings(updatedBookings);
      })
      .catch(error => console.error("Deletion error:", error));  // Debugging log
  };

  const onSuggestionsFetchRequestedFrom = ({ value }) => {
    setSuggestionsFrom(getSuggestions(value));
  };

  const onSuggestionsClearRequestedFrom = () => {
    setSuggestionsFrom([]);
  };

  const onChangeFrom = (event, { newValue }) => {
    setFrom(newValue);
  };

  const onSuggestionsFetchRequestedTo = ({ value }) => {
    setSuggestionsTo(getSuggestions(value));
  };

  const onSuggestionsClearRequestedTo = () => {
    setSuggestionsTo([]);
  };

  const onChangeTo = (event, { newValue }) => {
    setTo(newValue);
  };

  return (
    <div className="container">
      <header className="header">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="redBus logo" className="logo" />
      </header>
      <div className="main-content">
        <h1 className="main-heading">India's No. 1 Online Bus Ticket Booking Site</h1>
      </div>
      <div className="form-container">
        <div className="input-group">
          <Autosuggest
            suggestions={suggestionsFrom}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedFrom}
            onSuggestionsClearRequested={onSuggestionsClearRequestedFrom}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <span className="dropdown-item">{suggestion}</span>}
            inputProps={{
              placeholder: 'From',
              value: from,
              onChange: onChangeFrom,
              className: 'input-field'
            }}
          />
          <Autosuggest
            suggestions={suggestionsTo}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedTo}
            onSuggestionsClearRequested={onSuggestionsClearRequestedTo}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <span className="dropdown-item">{suggestion}</span>}
            inputProps={{
              placeholder: 'To',
              value: to,
              onChange: onChangeTo,
              className: 'input-field'
            }}
          />
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="submit-button" onClick={handleBookTicket}>BOOK TICKET</button>
        </div>
      </div>
      {bookings.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Edit</th>
                <th>Complete Journey</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                  <td>{booking.date}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                  </td>
                  <td>
                    <button className="complete-button" onClick={() => handleCompleteJourney(booking._id)}>Complete Journey</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RedBusComponent;
