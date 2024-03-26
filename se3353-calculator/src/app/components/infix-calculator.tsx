'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';

const InfixCalculator = () => {

    // States to manage different values in the calculator
    const [operand1, setOperand1] = useState<number>();
    const [input, setInput] = useState<string>('');
    const [operator, setOperator] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [compute, setCompute] = useState<boolean>(false);
    const [storedValue, setStoredValue] = useState<string>('');
    const [msg, setMsg] = useState<string>('');

    // Listen for keypresses for calculator input
    useEffect(() => {
        // Attach event listener to window instead of dialogElement
        window.addEventListener('keydown', handleKeyDown);

        // Remove listener when component unmounts
        return () => {
            reset();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Function to handle keypresses as input
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key >= '0' && event.key <= '9') {
            setInput(prevInput => prevInput + event.key);
        }
        if (event.key === '+') opPressed('+');
        if (event.key === '-') opPressed('-');
        if (event.key === 'x') opPressed('x');
        if (event.key === '/') opPressed('/');
        if (event.key === 'Enter' || event.key === '=') calculate();
    };

    // Function to handle operator input from buttons
    const opPressed = (op: string) => {
        if (!input && !operand1) return;

        // If the current input is the first operand
        if (!operand1) {
            setOperand1(parseInt(input));
            setInput('');
        }

        // If the user has inputted the second operand
        if (operand1 && input) {
            // Perform the calculation
            calculate();
        }

        // Allow the calculation to continue
        setOperator(op);
        setCompute(false);
    }

    // Function to handle number input from buttons
    const numberPressed = (num: string) => {
        setInput(input + num);

        // If result is currently displaying, reset the calculation
        if (compute) {
            setOperand1(undefined);
            setCompute(false);
        }
    }

    const save = () => {
        // Store either the input or the result to the memory
        if (input) setStoredValue(input);
        else if (result) setStoredValue(result);

        setMsg('Value saved to memory.');
        const delay = setTimeout(() => { setMsg('') }, 1500);
    }

    // Load the stored value from memory
    const load = () => {
        setInput(storedValue);

        // Allow a new calculation to be performed
        if (compute) setCompute(false);

        setMsg('Value loaded from memory.');
        const delay = setTimeout(() => { setMsg('') }, 1500);
    }

    // Reset the calculator
    const reset = () => {
        setOperand1(0);
        setInput('');
        setOperator('');
        setResult('');
        setCompute(false);
        setMsg('');
    }

    // Function to handle calculation
    const calculate = () => {
        let ans = '';

        // If only the first value is inputted, simply display that value
        if (!operand1) {
            setResult(input);
            ans = input;
        }

        // If the user has inputted the second operand
        if (operand1 && input) {
            const operand2 = parseInt(input);
            const expression = (operand1 + operator + operand2).replace('x', '*');

            // Perform the calculation
            switch (operator) {
                case '+':
                    ans = eval(expression).toString();
                    break;
                case '-':
                    ans = eval(expression).toString();
                    break;
                case 'x':
                    ans = eval(expression).toString();
                    break;
                case '/':
                    ans = eval(expression).toString();
                    break;
            }

            // Store the result and allow a new calculation to be performed
            setResult(ans);
            setInput('');
            setOperator('');
            if (ans) setOperand1(parseInt(ans));
            setCompute(true);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="py-2 px-4 rounded m-2">
                    INFIX CALCULATOR
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent DialogContentEditor">
                    <div className="flex flex-row justify-between items-center mb-0">
                        <div></div>
                        <Dialog.Title className="DialogTitle pl-5 items-center text-center">
                            INFIX CALCULATOR
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="flex flex-row space-x-2 rounded-sm" aria-label="Close">
                                <h3>X</h3>
                            </button>
                        </Dialog.Close>
                    </div>
                    <div className="grid grid-cols-4 ml-12 mr-12 gap-x-4 mb-5">
                        <div className="col-span-4">
                            <h3 className=" text-tertiary text-center text-xs text-red-300">{msg}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 ml-12 mr-12 gap-x-4">
                        <div className="col-span-4">
                            <div className="w-full p-2 pr-5 rounded text-3xl text-right text-black border border-black">
                                {compute ? result : input ? input : operand1 ? operand1 : '0'}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-4 ml-12 mr-12 gap-x-1">
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => reset()}>
                                <h1 className="aspect-content">AC</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => save()}>
                                <h1 className="aspect-content">M</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => load()}>
                                <h1 className="aspect-content">MR</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            {operator == '/' && !input ?
                                <button className="w-full aspect-content rounded-sm bg-tertiary text-accent hover:bg-secondary" aria-label="Close" onClick={() => opPressed('/')}>
                                    <h1 className="aspect-content">/</h1>
                                </button> :
                                <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => opPressed('/')}>
                                    <h1 className="aspect-content">/</h1>
                                </button>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-1 ml-12 mr-12 gap-x-1">
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('7')}>
                                <h1 className="aspect-content">7</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('8')}>
                                <h1 className="aspect-content">8</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('9')}>
                                <h1 className="aspect-content">9</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            {operator == 'x' && !input ?
                                <button className="w-full aspect-content rounded-sm bg-tertiary text-accent hover:bg-secondary" aria-label="Close" onClick={() => opPressed('x')}>
                                    <h1 className="aspect-content">x</h1>
                                </button> :
                                <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => opPressed('x')}>
                                    <h1 className="aspect-content">x</h1>
                                </button>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-1 ml-12 mr-12 gap-x-1">
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('4')}>
                                <h1 className="aspect-content">4</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('5')}>
                                <h1 className="aspect-content">5</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('6')}>
                                <h1 className="aspect-content">6</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            {operator == '-' && !input ?
                                <button className="w-full aspect-content rounded-sm bg-tertiary text-accent hover:bg-secondary" aria-label="Close" onClick={() => opPressed('-')}>
                                    <h1 className="aspect-content">-</h1>
                                </button> :
                                <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => opPressed('-')}>
                                    <h1 className="aspect-content">-</h1>
                                </button>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-1 ml-12 mr-12 gap-x-1">
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('1')}>
                                <h1 className="aspect-content">1</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('2')}>
                                <h1 className="aspect-content">2</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('3')}>
                                <h1 className="aspect-content">3</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                            {operator == '+' && !input ?
                                <button className="w-full aspect-content rounded-sm bg-tertiary text-accent hover:bg-secondary" aria-label="Close" onClick={() => opPressed('+')}>
                                    <h1 className="aspect-content">+</h1>
                                </button> :
                                <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => opPressed('+')}>
                                    <h1 className="aspect-content">+</h1>
                                </button>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mt-1 ml-12 mr-12 gap-x-1">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => numberPressed('0')}>
                                <h1 className="aspect-content">0</h1>
                            </button>
                        </div>
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-1">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => calculate()}>
                                <h1 className="aspect-content">=</h1>
                            </button>
                        </div>
                    </div>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default InfixCalculator;
