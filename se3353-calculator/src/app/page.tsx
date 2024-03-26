'use client';

import InfixCalculator from './components/infix-calculator';
import BEDMASCalculator from './components/bedmas-calculator';
import RPNCalculator from './components/rpn-calculator';
import { useState } from 'react';

interface Log {
  name: string;
  testNum: number;
  time: string;
  calculator: string;
  keypress: string;
}

export default function Home() {

  const [name, setName] = useState<string>('David');
  const [input, setInput] = useState<string>('');
  const [caseNum, setCaseNum] = useState<number>(0);
  const [logs, setLogs] = useState<Record<string, Log>>({});

  const logEvent = (type: string, button: string) => {
    // Get the time for the log
    const now = new Date();
    const datetime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
    console.log(datetime);

    // Save the log to the list
    setLogs(prevLogs => ({
      ...prevLogs,
      [`${datetime}-${name}`]: { name: name, testNum: caseNum, time: datetime, calculator: type, keypress: button }
    }));
  }

  const logToJSON = () => {
    const logEntries: Log[] = Object.values(logs);
    const jsonContent = JSON.stringify(logEntries, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute of the link
    link.download = 'logs.json';

    // Set the href of the link to the URL of the blob
    link.href = URL.createObjectURL(blob);

    // Append the link to the body
    document.body.appendChild(link);

    // Download the file
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  }

  const start = () => {
    if (name === '') {
      alert('Please enter a name');
      return;
    }

    setCaseNum(caseNum + 1);
    setName(input);

    alert('Test started');
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="m-10 mb-0 text-tertiary">SE3353 Calculator Project</h1>
      <h3 className="m-5 text-tertiary">Made by David Tam</h3>
      <div className="className=flex flex-row p-24 items-center justify-between p-4">
        <InfixCalculator callback={logEvent} />
        <RPNCalculator callback={logEvent} />
        <BEDMASCalculator callback={logEvent} />
      </div>
      <div className="flex flex-row items-center justify-between p-4">
        <button className="py-2 px-4 rounded m-2" onClick={() => logToJSON()}>
          GET LOGS
        </button>
      </div>
      <div className="flex flex-row items-center justify-between p-4">
        <input className="Input" placeholder={"Enter your name"} value={input} onChange={(e) => setInput(e.target.value)} type="text" min="0" max="24" />
        <button className=" rounded m-2" onClick={() => start()}>
          START NEW TEST
        </button>
      </div>
    </main>
  );
}
