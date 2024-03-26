'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';

enum states {
    initial,
    empty,
    populated1,
    populated2,
    result
}

const RPNCalculator = () => {

    // States to manage different values in the calculator
    const [state, setState] = useState<states>(states.initial);
    const [stack, setStack] = useState<number[]>([]);
    const [input, setInput] = useState<string>('');
    const [operator, setOperator] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [storedValue, setStoredValue] = useState<string>('');
    const [msg, setMsg] = useState<string>('');

    // Function to handle operator input from buttons
    const opPressed = (op: string) => {
        if (state == states.populated1 || state == states.populated2) {
            console.log(`stack: ${stack}`);
            const operand1 = stack.pop();
            const operand2 = parseInt(input);

            const ans = calculate(operand1!, operand2, op);
            setResult(ans);
            console.log(`stack: ${[...stack, parseFloat(ans)]}`);
            setState(states.result);

        } else if (state == states.result) {
            stack.push(parseFloat(result));
            if (stack.length > 1) {
                console.log(`stack: ${stack}`);
                const operand1 = stack.pop();
                const operand2 = stack.pop();

                const ans = calculate(operand1!, operand2!, op);
                setResult(ans);
                console.log(`stack: ${[...stack, parseFloat(ans)]}`);
            }
        }
    }

    // Function to handle number input from buttons
    const numberPressed = (num: string) => {
        if (state == states.initial) {
            setState(states.empty);
            setInput(num);
        } else if (state == states.populated1 || state == states.result) {
            setState(states.populated2);
            setInput(num);
            if (state == states.result) {
                setStack([...stack, parseFloat(result)]);
            }
        } else {
            setInput(input + num);
        }
    }

    const save = () => {
        // Store either the input or the result to the memory
        if (state != states.initial) {
            if (state == states.result)
                setStoredValue(result);
            else
                setStoredValue(input);

            setMsg('Value saved to memory.');
            const delay = setTimeout(() => { setMsg('') }, 1500);
        }
    }

    // Load the stored value from memory
    const load = () => {
        setInput(storedValue);

        if (state == states.initial) {
            setState(states.empty);
        } else if (state == states.populated1 || state == states.result) {
            setState(states.populated2);
            if (state == states.result) {
                setStack([...stack, parseFloat(result)]);
            }
        }

        setMsg('Value loaded from memory.');
        const delay = setTimeout(() => { setMsg('') }, 1500);
    }

    // Function to push to stack
    const enterPressed = () => {
        if (state == states.empty) {
            setStack([parseInt(input)]);
            setState(states.populated1);
        } else if (state == states.populated1 || state == states.populated2) {
            setStack([...stack, parseInt(input)]);
            setState(states.populated1);
        } else if (state == states.result) {
            setStack([...stack, parseFloat(result)]);
            setState(states.populated2);
        }
    }

    // Reset the calculator
    const reset = () => {
        setStack([]);
        setState(states.initial);
        setInput('');
        setOperator('');
        setResult('');
        setMsg('');
    }

    // Function to handle calculation
    const calculate = (x: number, y: number, op: string) => {
        let ans = '';

        switch (op) {
            case '+':
                ans = (x + y).toString();
                break;
            case '-':
                ans = (x - y).toString();
                break;
            case 'x':
                ans = (x * y).toString();
                break;
            case '/':
                ans = (x / y).toString();
                break;
        }

        return ans;
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="py-2 px-4 rounded m-2">
                    RPN CALCULATOR
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent DialogContentEditor">
                    <div className="flex flex-row justify-between items-center mb-0">
                        <div></div>
                        <Dialog.Title className="DialogTitle pl-5 items-center text-center">
                            RPN CALCULATOR
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
                            <div className="w-full p-2 pr-5 rounded text-xl text-right text-black border border-black">
                                {stack.length > 1 ? stack[stack.length - 2] : '0'}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 mr-12 gap-x-4">
                        <div className="col-span-4">
                            <div className="w-full p-2 pr-5 rounded text-xl text-right text-black border border-black">
                                {stack.length > 0 ? stack[stack.length - 1] : '0'}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 mr-12 gap-x-4">
                        <div className="col-span-4">
                            <div className="w-full p-2 pr-5 rounded text-3xl text-right text-black border border-black">
                                {state == states.initial ? '0' : state != states.result ? input : result}
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
                        <div className="col-span-2">
                            <button className="w-full aspect-content rounded-sm" aria-label="Close" onClick={() => enterPressed()}>
                                <h1 className="aspect-content">ENTER</h1>
                            </button>
                        </div>
                    </div>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RPNCalculator;
