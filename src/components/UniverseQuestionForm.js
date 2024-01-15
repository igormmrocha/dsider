import React, { useState } from 'react';

const UniverseQuestionForm = ({ userEmail }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askUniverse = async () => {
    if (question.trim() !== '') {
      try {
        setLoading(true);

        const response = await fetch('/api/askUniverse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, userEmail }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setTimeout(() => {
          setAnswer(data.answer);
          setQuestion('');
          setLoading(false);
          console.log('Question saved to the database:', data.question);
        }, 1000);

      } catch (error) {
        console.error('Error:', error.message);
        setLoading(false);
      }
    } else {
      alert('Please enter a question before asking the universe.');
    }
  };

  return (
    <div className="text-center p-8">
      <form>
        <label htmlFor="question" className="block mb-2">
          Ask a question to the universe:
        </label>
        <input
          type="text"
          id="question"
          name="question"
          className="border p-2 w-full mb-4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <br />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={askUniverse}
        >
          Get Answer
        </button>
      </form>
      {loading && <p>Asking universe...</p>}
      {answer && (
        <p
          className={`font-bold mt-4 ${
            answer === 'Yes' ? 'text-green-500' : answer === 'No' ? 'text-red-500' : ''
          }`}
          style={{ transition: 'opacity 0.5s', opacity: 1 }}
        >
          {answer}
        </p>
      )}
    </div>
  );
};

export default UniverseQuestionForm;
