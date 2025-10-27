import React from 'react';
import Choices from './Choices.js';

function QuestionCard({ question, index, selected, onSelect }) {
  return (
    <div className="question-card">
      <h3>Question {index + 1}</h3>
      <p>{question.q}</p>
      <Choices
        options={question.options}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}

export default QuestionCard;

