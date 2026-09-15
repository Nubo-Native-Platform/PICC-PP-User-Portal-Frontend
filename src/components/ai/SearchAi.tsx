import React, { useState, useRef, useEffect } from 'react';

const SearchAi = () => {
    const [input, setInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [dots, setDots] = useState('');

    const currentAnswerRef = useRef('');
    const questionRef = useRef('');

    useEffect(() => {
        if (!isStreaming) {
            setDots('');
            return;
        }

        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        return () => clearInterval(interval);
    }, [isStreaming]);

    const handleSearch = () => {
        if (!input.trim()) return;

        setIsStreaming(true);
        setCurrentAnswer('');
        setInput('');
        currentAnswerRef.current = '';
        questionRef.current = input.trim();

        const encodedQuestion = encodeURIComponent(questionRef.current);
        const qaBaseUrl = import.meta.env.VITE_API_QA || import.meta.env.VITE_APP_DOMAIN || "http://localhost:3000";
        const url = `${qaBaseUrl}/qa/answers/stream?question=${encodedQuestion}`;

        const eventSource = new EventSource(url);

        eventSource.addEventListener('message', (event) => {
            if (!event.data.trim()) return;
            setCurrentAnswer(prev => {
                const updated = prev + event.data;
                currentAnswerRef.current = updated;
                return updated;
            });
        });

        eventSource.addEventListener('end', () => {
            eventSource.close();
            setTimeout(() => {
                setChatHistory(prev => [{ question: questionRef.current, answer: currentAnswerRef.current }, ...prev]);
                setIsStreaming(false);
                setInput('');
            }, 0);
        });

        eventSource.onerror = (event) => {
            console.error("EventSource error:", event);
            eventSource.close();
            setIsStreaming(false);
        };
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (input) {
                handleSearch();
            } else {
                alert("Please fill in all required fields.");
            }
        }
    };

    return (
        <div className='min-h-screen flex-start-center flex-col page-padding-large' onKeyDown={handleKeyDown}>
            <div className='nnp-title font-xl font-bold tracking-[1pt]'>Nubo Cognitive Search</div>
            <div className='nnp-title tracking-[1pt]'>Ask whatever you want to know about us and on Cloud Native Technologies.</div>

            <div>
                <div className='flex'>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='nnp-border rounded-md p-2 w-[55vw] bg-[var(--component-color-secondary)]'
                        placeholder='Type your question here...' />
                    <button className='nnp-btn-tertiary rounded mx-3 p-3' onClick={handleSearch} disabled={isStreaming}>Search</button>
                </div>
            </div>

            <div className='page-padding-medium nnp-border-bottom w-full'></div>

            <div className='page-padding-medium w-full'>
                {isStreaming && (
                    <div className="mb-4">
                        <div className="font-bold text-[var(--text-color-link)]">Q: {questionRef.current}</div>
                        <div className='font-sm'>A: {currentAnswer ? currentAnswer : `Thinking${dots}`}</div>
                    </div>
                )}
                {chatHistory.map((chat, index) => (
                    <div key={index} className="mb-4">
                        <div className={`font-bold text-[var(--text-color-link)]`}>Q: {chat.question}</div>
                        <div className='font-sm'>A: {chat.answer}</div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default SearchAi;
