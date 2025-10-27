import React from 'react';
function Choices({ options, selected, onSelect }) {
  return (
    <div className="choices">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt)}
          className={selected === opt ? "selected" : ""}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default Choices;

