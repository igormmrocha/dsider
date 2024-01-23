// components/RecentQuestions.js

import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';
import Logo from '../logo/logo.png';

const RecentQuestions = () => {
  const [recentQuestions, setRecentQuestions] = useState([]);

  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        const response = await fetch('/api/getRecentQuestions');
        if (!response.ok) {
          throw new Error('Network response was not ok, recent questions');
        }

        const data = await response.json();
        setRecentQuestions(data);
      } catch (error) {
        console.error('Error fetching recent questions:', error.message);
      }
    };

    fetchRecentQuestions();
  }, []);

  const handleShareImage = async (question, platform, index) => {
    try {
      const canvasId = `canvas-${index}`;

      const listItem = document.querySelector(`#${canvasId}`);

      if (!listItem) {
        console.error(`List item with id ${canvasId} not found.`);
        return;
      }

      // Use HTML2Canvas to capture the content of the specific list item
      const canvas = await html2canvas(listItem, {
        useCORS: true,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL();

      // Download the image for manual sharing on Instagram
      if (platform === 'instagram') {
        download(dataUrl, 'shared_image.png');
        return;
      }
    } catch (error) {
      console.error('Error creating and sharing image:', error.message);
    }
  };

  return (
    <div className="mt-8">
      <ul>
        {recentQuestions.map((question, index) => (
          <li key={question.id} className="mb-6 p-4 bg-white rounded-lg shadow-md" id={`canvas-${index}`}>
            <div className="flex items-center justify-center">
              <span className="whitespace-nowrap text-xl font-semibold ">DSIDER APP</span>
              <img src={Logo.src} style={{ width: 50, height: 50 }} className="ml-3 h-6 sm:h-9" alt="Logo" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">{question.question}</p>
              {question.possibleAnswers && (
                <div className="flex">
                  {question.possibleAnswers.map((possibleAnswer, i) => (
                    <span key={i} className={`mr-2`}>
                      {possibleAnswer}
                    </span>
                  ))}
                </div>
              )}
              <p className={`font-bold text-lg ${question.answer === 'No' ? 'text-red-500' : 'text-green-500'} : ''}`}>
                {question.answer}
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={() => handleShareImage(question, 'instagram', index)}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentQuestions;