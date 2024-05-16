import { useEffect, useRef } from 'react';

export default function Search({ query, setQuery }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputRef.current) return;

      if (e.key === 'Enter') {
        inputRef.current.focus();
        setQuery('');
      }
    }

    document.addEventListener('keydown', callback);
  }, [setQuery]);

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      ref={inputRef}
    />
  );
}
