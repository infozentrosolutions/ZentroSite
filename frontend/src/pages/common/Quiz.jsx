import { useState } from 'react';
import { CheckCircle, ArrowRight, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
    { id: 1, text: "Which part of application development interests you most?", options: ["User Interfaces & Design", "Databases & APIs", "Data Analysis & ML", "Enterprise Systems"] },
    { id: 2, text: "Which programming language are you most comfortable with or want to learn?", options: ["JavaScript", "Python", "Java", "HTML/CSS"] },
    { id: 3, text: "Do you prefer visual gratification (seeing what you build immediately) or logical puzzle-solving (data structures)?", options: ["Visual Gratification", "Logical Puzzle-Solving", "Both Equally", "Neither"] },
    { id: 4, text: "What kind of projects excite you?", options: ["Interactive Websites & Animations", "Scalable Web APIs", "AI Models & Analytics", "Mobile Apps"] },
    { id: 5, text: "How much prior coding experience do you have?", options: ["None / Beginner", "Some Knowledge", "Intermediate", "Advanced"] }
];

const Quiz = ({ isEmbedded = false, onViewPrograms }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleSelect = (optionIdx) => {
        setAnswers({ ...answers, [currentQ]: optionIdx });

        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(currentQ + 1), 300);
        } else {
            setTimeout(() => calculateResult(), 300);
        }
    };

    const calculateResult = () => {
        // Simple mock logic logic based on option indices
        const jscount = Object.values(answers).filter(v => v === 0).length;
        const pycount = Object.values(answers).filter(v => v === 1).length;
        const javacount = Object.values(answers).filter(v => v === 3).length;

        let suggested = "Frontend Web Dev";
        if (jscount >= 2) suggested = "MERN Stack Development";
        if (pycount >= 2) suggested = "Python Programming";
        if (javacount >= 2) suggested = "Java Development";

        setResult(suggested);
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <div className={`${isEmbedded ? 'py-4' : 'min-h-screen py-12'} flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative`}>
            {!isEmbedded && (
                <Link
                    to="/programs"
                    className="absolute top-24 left-4 sm:left-8 flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Programs
                </Link>
            )}

            <div className={`max-w-xl w-full ${isEmbedded ? '' : 'mt-10'}`}>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Internship Finder Quiz</h2>
                    <p className="mt-2 text-gray-600">Answer 5 quick questions to find your perfect tech match.</p>
                </div>

                {!result ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg shadow-md">
                        <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
                            <span>Question {currentQ + 1} of {questions.length}</span>
                            <div className="w-1/2 bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-6">{questions[currentQ].text}</h3>

                        <div className="space-y-3">
                            {questions[currentQ].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-indigo-50 transition-all font-medium text-gray-700"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg shadow-md text-center py-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Perfect Match</h3>
                        <p className="text-gray-500 mb-6">Based on your interests, we highly recommend:</p>

                        <div className="inline-block px-8 py-4 bg-indigo-50 border border-primary text-primary font-bold text-xl rounded-2xl mb-8">
                            {result}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                            {onViewPrograms ? (
                                <button onClick={onViewPrograms} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center justify-center">
                                    View Program <ArrowRight size={18} className="ml-2" />
                                </button>
                            ) : (
                                <Link to="/programs" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center justify-center">
                                    View Program <ArrowRight size={18} className="ml-2" />
                                </Link>
                            )}
                            <button onClick={resetQuiz} className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center justify-center">
                                <RefreshCcw size={18} className="mr-2" /> Retake Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
