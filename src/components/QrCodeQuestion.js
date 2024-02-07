import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';
import Logo from '../logo/logo.png';
import QRCode from 'qrcode.react';

const QrCodeQuestion = ({ userEmail }) => {
  const [QrCodeQuestion, setQrCodeQuestion] = useState([]);
  const [QrCodeUrl, setQrCodeUrl] = useState('');
  const [BaseLink, setBaseLink] = useState('');

  useEffect(() => {
    const fetchQrCodeQuestion = async () => {
      try {
        const response = await fetch('/api/getQrCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });

        if (!response.ok) {
          throw new Error('Erro');
        }
        const response2 = await fetch('/api/getBaseLink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });
        const data2 = await response2.json();
        console.log ('Base Link', data2);
        setBaseLink(data2);
        const data = await response.json();
        setQrCodeQuestion(data);
        generateQRCodeUrl(data2,data.id);
        console.log(data);
      } catch (error) {
        console.error('Erro:', error.message);
      }
    };

    fetchQrCodeQuestion();
  }, [userEmail]);

  const generateQRCodeUrl = (BaseLink, question) => {
    const url = `${BaseLink.baselink}qrcodevalidator?question=${encodeURIComponent(question)}`;
    console.log(question);
    console.log(url);
    setQrCodeUrl(url);
    return;
  };

  const handleCopyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = QrCodeUrl;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  const handleShareImage = async (id) => {
    try {
      const listItem = document.getElementById(id);
      console.log(id);

      if (!listItem) {
        console.error(`Erro ao compartilhar ${id} não encontrado.`);
        return;
      }

      const canvas = await html2canvas(listItem, {
        useCORS: true,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL();
      download(dataUrl, 'shared_image.png');
      return;
    } catch (error) {
      console.error('Erro ao compartilhar:', error.message);
    }
  };

  return (
    <div className="mt-8 bg-green-300 min-h-screen">

      <div className="flex mt-2 flex-col items-center justify-center mx-auto">
        <QRCode value={QrCodeUrl} id="qrcode" className="h-screen p-2 max-w-full" />
        <button
          className="text-gray-500 hover:text-gray-900 mt-4"
          onClick={() => handleShareImage('qrcode')}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
              stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="flex mt-2 flex-col items-center justify-center mx-auto">
          <div className="flex mt-2 flex-col items-center justify-center mx-auto">
            <input
              type="text"
              readOnly
              className="border border-gray-300 px-2 py-1 mr-2 text-black"
              value={QrCodeUrl}
            />
            <button
          className="text-gray-500 hover:text-gray-900 mt-4"
          onClick={() => handleCopyToClipboard()}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
              stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
          </div>
        </div>
        
      </div>
      <ul>
        <li key={QrCodeQuestion.id} className="mb-6 p-4 bg-white rounded-lg shadow-md" id="cardquestion">
          <div className="flex items-center justify-center">
            <span className="whitespace-nowrap text-xl font-semibold text-black ">Pergunta de {QrCodeQuestion.user && QrCodeQuestion.user.name}</span>
            <img src={Logo.src} style={{ width: 50, height: 50 }} className="ml-3 h-6 sm:h-9" alt="Logo" />
          </div>
          <div>
            <p className="text-lg font-semibold mb-2 text-black">{QrCodeQuestion.question}</p>
            <div>
              {QrCodeQuestion.qrAnswers && QrCodeQuestion.qrAnswers.map((answer) => (
                <p key={answer.id} className={`font-bold text-lg ${answer.answer ? 'text-green-500' : 'text-red-500'}`}>
                  {answer.answerName}: {answer.answer ? 'Eu' : "Eu não"}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="text-gray-500 hover:text-gray-900"
              onClick={() => handleShareImage('cardquestion')}
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
      </ul>
    </div>
  );
};

export default QrCodeQuestion;
