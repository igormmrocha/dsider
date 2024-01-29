import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Logo from '../logo/logo.png';
import html2canvas from 'html2canvas';
import download from 'downloadjs';
import Photo from '../logo/no_one.jpg';

interface UniverseQuestionFormProps {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  askUniverse: () => void;
  questionType: string;
  setQuestionType: React.Dispatch<React.SetStateAction<string>>;
  possibleAnswers: string;
  setPossibleAnswers: React.Dispatch<React.SetStateAction<string>>;
}

const UniverseQuestionForm: React.FC<UniverseQuestionFormProps> = ({
  question,
  setQuestion,
  askUniverse,
  questionType,
  setQuestionType,
  possibleAnswers,
  setPossibleAnswers,
}) => {
  const handlePossibleAnswersChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    const answersArray = inputValue.split(',').map((answer: string) => answer.trim());

    // Limit to 40 characters for each answer
    if (answersArray.every((answer: string | any[]) => answer.length <= 40) && answersArray.length >= 2) {
      setPossibleAnswers(inputValue);
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
          defaultValue={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div>
          <label>
            <input
              type="radio"
              name="questionType"
              value="yesNo"
              checked={questionType === 'yesNo'}
              onChange={() => setQuestionType('yesNo')}
            />
            Yes/No
          </label>
          <label>
            <input
              type="radio"
              name="questionType"
              value="multipleChoice"
              checked={questionType === 'multipleChoice'}
              onChange={() => setQuestionType('multipleChoice')}
            />
            Multiple Choice
          </label>
        </div>
        {questionType === 'multipleChoice' && (
          <div>
            <label htmlFor="possibleAnswers" className="block mb-2">
              Possible answers (comma-separated):
            </label>
            <input
              type="text"
              id="possibleAnswers"
              name="possibleAnswers"
              className="border p-2 w-full mb-4"
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
          Get Answer
        </button>
      </form>
    </div>
  );
};

interface RecentQuestionsProps {
  question: string;
  answer: string;
  handleShareImage: () => void;
  questionType: string; // Added prop
  possibleAnswers: string; // Added prop
}

const RecentQuestions: React.FC<RecentQuestionsProps> = ({
  question,
  answer,
  handleShareImage,
  questionType,
  possibleAnswers,
}) => {
  return (
    <div className="bg-green-300">
      <div className="mt-8 bg-green-300">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md" id="canvas">
          <div className="flex items-center justify-center">
            <span className="whitespace-nowrap text-xl font-semibold">DSIDER APP</span>
            <img
              src={Logo.src}
              style={{ width: 50, height: 50 }}
              className="ml-3 h-6 sm:h-9"
              alt="Logo"
            />
          </div>
          <div>
            <p className="text-lg font-semibold mb-2">{question}</p>
            <div>{questionType === 'yesNo' ?  '' : possibleAnswers}</div>
            <p className={`font-bold text-lg ${answer === 'No' ? 'text-red-500' : 'text-green-500'}`}>
              {answer}
            </p>

            
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="text-gray-500 hover:text-gray-900"
              onClick={handleShareImage}
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { data } = useSession();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [possibleAnswers, setPossibleAnswers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askUniverse = async () => {
    if (question.trim() !== '') {
      try {
        setLoading(true);

        // Simulate API behavior based on questionType
        let newAnswer;
        if (questionType === 'multipleChoice') {
          const trimmedAnswers = possibleAnswers.split(',').map((answer) => answer.trim());
          const validAnswers = trimmedAnswers.filter((answer) => answer.length > 0);

          if (validAnswers.length < 2) {
            throw new Error('Please provide at least two separated answers for Multiple Choice questions.');
          }

          // Simulate a random answer for multiple choice
          const randomIndex = Math.floor(Math.random() * validAnswers.length);
          newAnswer = validAnswers[randomIndex];
        } else {
          // Simulate a random Yes/No answer
          const randomNumber = Math.floor(Math.random() * 2);
          newAnswer = randomNumber === 0 ? 'Yes' : 'No';
        }

        // Simulate saving question to the database
        setAnswer(newAnswer);
        //setQuestion('');
        //setPossibleAnswers(''); // Clear possible answers after asking
        console.log('Question saved to the database:', question);

        // Adjust the state update logic
        setTimeout(() => {
          setLoading(false);
          //window.location.reload();
        }, 500);
      } catch (error) {
        //console.error('Error:', error.message);
        setLoading(false);
        //setError(error.message); // Set error message
        //alert(error.message); // Show an alert with the error message
      }
    } else {
      alert('Please enter a question before asking the universe.');
    }
  };

  const handleShareImage = async () => {
    const canvasElement = document.getElementById('canvas');

    // Use HTML2Canvas to capture the content of the specific list item
    if (canvasElement) {
      try {
        const canvas = await html2canvas(canvasElement, {
          useCORS: true,
          scale: 2,
        });

        const dataUrl = canvas.toDataURL();

        // Download the image for manual sharing on Instagram
        download(dataUrl, 'shared_image.png');
        return;
      } catch (error) {
        console.error('Error creating and sharing image');
      }
    } else {
      console.error('Element with ID "canvas" not found.');
    }
  };

  return (
    <div className="bg-green-300 min-h-screen">
      <Navbar fluid rounded>
        <Navbar.Brand>
          <img
            src={Logo.src}
            style={{ width: 50, height: 50 }}
            className="mr-3 h-6 sm:h-9"
            alt="Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold">DSIDER</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={data?.user?.image || Photo.src} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{data?.user?.name || 'Anonymous'}</span>
              <span className="block truncate text-sm font-medium">{data?.user?.email}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = '/';
              }}
            >
              Back to Login
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
      <UniverseQuestionForm
        question={question}
        setQuestion={setQuestion}
        askUniverse={askUniverse}
        questionType={questionType}
        setQuestionType={setQuestionType}
        possibleAnswers={possibleAnswers}
        setPossibleAnswers={setPossibleAnswers}
      />
      <RecentQuestions
        question={question}
        answer={answer}
        handleShareImage={handleShareImage}
        questionType={questionType}
        possibleAnswers={possibleAnswers}
      />
    </div>
  );
}
