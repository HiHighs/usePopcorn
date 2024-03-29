import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

import StarRating from './StarRating';

function Test() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <StarRating color='red' onSetRating={setRating} />
      <p>This movie was rated {rating} stars.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*
    <App />
  */}
    <StarRating maxRating={5} />
    <StarRating maxRating={10} />
    <StarRating />
    <Test />
  </React.StrictMode>
);
