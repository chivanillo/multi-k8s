import React, { useEffect, useState } from "react";
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    const valuesTemp = await axios.get('/api/values/current');
    setValues(valuesTemp.data);
  }

  const fetchIndexes = async () => {
    const seenIndexesTemp = await axios.get('/api/values/all');
    console.log('seen = ', seenIndexesTemp);
    setSeenIndexes(seenIndexesTemp.data);
  }

  const renderSeenIndexes = () => (
    seenIndexes.map(({ number }) => number).join(', ')
  );

  const renderValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      )
    }
    return entries;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/values', { index });
    setIndex('');
    fetchValues();
    fetchIndexes();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={event => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
}

export default Fib;
