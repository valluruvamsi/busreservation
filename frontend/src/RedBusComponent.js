import React, { useState, useEffect } from 'react';
import './RedBusComponent.css';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

const cities = [
  'New Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Lucknow'
];

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : cities.filter(
    city => city.toLowerCase().slice(0, inputLength) === inputValue
  );
};


const SharedClasses = {
  flex: 'flex',
  itemsCenter: 'items-center',
  spaceX4: 'space-x-4',
  bgRed500: 'bg-red-500',
  textWhite: 'text-white',
  p6: 'p-6',
  textCenter: 'text-center',
  mb6: 'mb-6',
  text2xl: 'text-2xl',
  fontBold: 'font-bold',
  justifyCenter: 'justify-center',
  roundedFull: 'rounded-full',
  shadowLg: 'shadow-lg',
  bgWhite: 'bg-white',
  p4: 'p-4',
  rounded: 'rounded',
  textXl: 'text-xl',
  roundedT3xl: 'rounded-t-3xl',
  mt12: '-mt-12',
  gridCols1: 'grid-cols-1',
  gridCols2: 'grid-cols-2',
  gridCols4: 'grid-cols-4',
  gap4: 'gap-4',
  grid: 'grid',
  mdGridCols2: 'md:grid-cols-2',
  lgGridCols4: 'lg:grid-cols-4',
  textBlue500: 'text-blue-500',
};

const RedBusComponent = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleBookTicket = () => {
    const newBooking = { from, to, date };
    if (editIndex !== null) {
      const bookingId = bookings[editIndex]._id;
      axios.put(`/api/bookings/${bookingId}`, newBooking)
        .then(response => {
          const updatedBookings = bookings.map((booking, index) =>
            index === editIndex ? { ...newBooking, _id: bookingId } : booking
          );
          setBookings(updatedBookings);
          setEditIndex(null);
        })
        .catch(error => console.error(error));
    } else {
      axios.post('/api/bookings', newBooking)
        .then(response => {
          setBookings([...bookings, { ...newBooking, _id: response.data._id }]);
        })
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

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChangeFrom = (event, { newValue }) => {
    setFrom(newValue);
  };

  const onChangeTo = (event, { newValue }) => {
    setTo(newValue);
  };

  return (
    <div className={`${SharedClasses.bgRed500} ${SharedClasses.textWhite} ${SharedClasses.p6}`}>
      <header className={`${SharedClasses.flex} ${SharedClasses.justifyBetween} ${SharedClasses.itemsCenter} ${SharedClasses.mb6}`}>
        <div className={`${SharedClasses.flex} ${SharedClasses.itemsCenter} ${SharedClasses.spaceX4}`}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="redBus logo" className="logo" />
        </div>
      </header>
      <div className={`${SharedClasses.textCenter} ${SharedClasses.mb6}`}>
        <h1 className={`${SharedClasses.text2xl} ${SharedClasses.fontBold}`}>India's No. 1 Online Bus Ticket Booking Site</h1>
      </div>
      <div className={`${SharedClasses.flex} ${SharedClasses.justifyCenter} ${SharedClasses.itemsCenter} ${SharedClasses.mb6}`}>
        <div className={`${SharedClasses.bgWhite} ${SharedClasses.p4} ${SharedClasses.roundedFull} ${SharedClasses.shadowLg} ${SharedClasses.flex} ${SharedClasses.itemsCenter} ${SharedClasses.spaceX4}`}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <div style={{ color: 'black' }}>{suggestion}</div>}
            inputProps={{
              placeholder: 'From',
              value: from,
              onChange: onChangeFrom,
              className: 'border-none outline-none p-2 text-black'
            }}
          />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <div style={{ color: 'black' }}>{suggestion}</div>}
            inputProps={{
              placeholder: 'To',
              value: to,
              onChange: onChangeTo,
              className: 'border-none outline-none p-2 text-black'
            }}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-none outline-none p-2 text-black" />
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleBookTicket}>Book Ticket</button>
        </div>
      </div>
      <div className={`${SharedClasses.textCenter} ${SharedClasses.mb6}`}>
        <h2 className={`${SharedClasses.textXl} ${SharedClasses.fontBold}`}>Apno ko, Sapno ko Kareeb Laaye.</h2>
      </div>
      <div className={`${SharedClasses.bgWhite} ${SharedClasses.p6} ${SharedClasses.roundedT3xl} ${SharedClasses.shadowLg} ${SharedClasses.mt12}`}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Origin</th>
              <th className="py-2">Destination</th>
              <th className="py-2">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="text-black">
                <td className="py-2">{booking.from}</td>
                <td className="py-2">{booking.to}</td>
                <td className="py-2">{booking.date}</td>
                <td className="py-2">
                  <button className="text-blue-500" onClick={() => handleEdit(index)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RedBusComponent;
