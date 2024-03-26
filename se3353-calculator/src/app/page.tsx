import Link from 'next/link';
import InfixCalculator from './components/infix-calculator';
import BEDMASCalculator from './components/bedmas-calculator';
import RPNCalculator from './components/rpn-calculator';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="m-10 mb-0 text-tertiary">SE3353 Calculator Project</h1>
      <h3 className="m-5 text-tertiary">Made by David Tam</h3>
      <div className="className=flex flex-row p-24 items-center justify-between p-4">
        <InfixCalculator />
        <RPNCalculator />
        <BEDMASCalculator />
      </div>
    </main>
  );
}
