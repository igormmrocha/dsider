import React, { useState } from 'react';

const UniverseQuestionForm = ({ userEmail }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState('yesNo'); // Default to yes/no
  const [possibleAnswers, setPossibleAnswers] = useState('');
  const [refreshTime, setRefreshTime] = useState(1);

  const askUniverse = async () => {
    if (question.trim() !== '') {
      try {
        setLoading(true);

        if (questionType === 'multipleChoice') {
          const trimmedAnswers = possibleAnswers.split(',').map(answer => answer.trim());
          const validAnswers = trimmedAnswers.filter(answer => answer.length > 0);

          if (validAnswers.length < 2) {
            throw new Error('Forneça pelo menos duas respostas separadas');
          }
        }

        const response = await fetch('/api/askUniverse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, userEmail, questionType, possibleAnswers }),
          
        });

        
        if (!response.ok) {
          throw new Error('Não foi possível enviar pergunta');
        }

        const data = await response.json();

        setTimeout(() => {
          setAnswer(data.answer);
          setQuestion('');
          setPossibleAnswers('');
          
          setLoading(false);
          //console.log('Question saved to the database:', data.question);
        }, 200);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Error:', error.message);
        setLoading(false);
        alert(error.message); // Show an alert with the error message
      }
    } else {
      alert('Por favor escreva uma pergunta antes de enviar ao universo');
    }
  };

  const handlePossibleAnswersChange = (e) => {
    const inputValue = e.target.value;
    const answersArray = inputValue.split(',').map(answer => answer.trim());

    // Limit to 40 characters for each answer
    if (answersArray.every(answer => answer.length <= 40) && answersArray.length >= 2) {
      setPossibleAnswers(inputValue);
    }
  };

  return (
    <div className="text-center p-8">
      <form>
        <label htmlFor="question" className="block mb-2 text-black">
          Pergunte ao universo:
        </label>
        <input
          type="text"
          id="question"
          name="question"
          className="border p-2 w-full mb-4 text-black"
          defaultValue={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div className = 'flex space-x-4'>
          <label>
            <input
              type="radio"
              name="questionType"
              value="yesNo"
              checked={questionType === 'yesNo'}
              onChange={() => setQuestionType('yesNo')}
            />
            Sim/Não
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              value="multipleChoice"
              checked={questionType === 'multipleChoice'}
              onChange={() => setQuestionType('multipleChoice')}
            />
            Multiplas
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              value="qrCode"
              checked={questionType === 'qrCode'}
              onChange={() => setQuestionType('qrCode')}
            />
            Compartilhada
          </label>
        </div>
        {questionType === 'multipleChoice' && (
          <div>
            <label htmlFor="possibleAnswers" className="block mb-2">
              Respostas possíveis (separadas por vírgula):
            </label>
            <input
              type="text"
              id="possibleAnswers"
              name="possibleAnswers"
              className="border p-2 w-full mb-4 text-black"
              defaultValue={possibleAnswers}
              onChange={handlePossibleAnswersChange}
              maxLength={80} // 40 characters for each answer and one comma for separation
              required
            />
          </div>
        )}
        
        <br />
        <button
          type="button"
          className="bg-purple-500 text-black px-4 py-2 rounded"
          onClick={askUniverse}
        >
          Obter Resposta
        </button>
      </form>
      {loading && <p>Perguntando ao universo...</p>}
      {answer && (
        <p
          className={`font-bold mt-4 ${
            answer === 'Sim' ? 'text-green-500' : answer === 'Não' ? 'text-red-500' : ''
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
