"use client";
import Button from "../components/button";
import { useEffect, useState } from "react";
import { questions } from "../data/questions";
import MultiSelectDropdown from "../components/multiselect-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "../components/logo";

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0
    })
};

const Quiz = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [value, setValue] = useState("");
    const [direction, setDirection] = useState(0);

    // Load saved answers
    useEffect(() => {
        const saved = localStorage.getItem("fitProfile");
        if (saved) {
            setAnswers(JSON.parse(saved));
        }
    }, []);

    // Save answers
    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            localStorage.setItem(
                "fitProfile",
                JSON.stringify(answers)
            );
        }
    }, [answers]);

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    // Sync value with the current question
    useEffect(() => {
        if (!currentQuestion) return;

        if (answers[currentQuestion.id] !== undefined) {
            setValue(answers[currentQuestion.id]);
        } else {
            setValue(currentQuestion.type === "multiselect" ? [] : "");
        }
    }, [step, currentQuestion, answers]);

    function nextQuestion() {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
        setDirection(1);
        setStep(prev => prev + 1);
    }

    function backQuestion() {
        setDirection(-1);
        setStep(prev => prev - 1);
    }

    if (step >= questions.length) {
        return (
            <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center h-screen px-4 gap-6">
                <h1 className="text-4xl font-bold text-center text-foreground">Quiz Summary</h1>
                <div className="w-full max-w-md bg-white/5 dark:bg-black/5 border border-gray-300 dark:border-zinc-800 rounded-xl p-6 shadow-md backdrop-blur-sm">
                    <pre className="text-sm overflow-x-auto text-foreground font-mono">
                        {questions.map((q, i) => {
                            return (
                                <div key={i} className="flex justify-between py-2 border-b border-gray-200/50 dark:border-zinc-800 last:border-0">
                                    <p className="">{q.id}. {q.question}: </p>
                                    <p className="font-bold  px-4 py-1 ">{Array.isArray(answers[q.id]) ? answers[q.id].join(", ") : answers[q.id]}</p>
                                </div>
                            )
                        })}
                    </pre>
                </div>
                <Link href="https://jackie-jeans.vercel.app/">
                    <Button
                        text="Visit Shop"
                    >
                    </Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center flex-col ">
            <Logo />
            <div className=" absolute top-5 right-5 z-50">
                <Link href="/ai-quiz">
                    <Button text="Fill using AI" />
                </Link>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="w-full max-w-md h-screen justify-center flex flex-col gap-6 px-4 "
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                            Question {step + 1} of {questions.length}
                        </span>
                        <h2 className="text-3xl font-bold text-foreground leading-tight">
                            {currentQuestion.question}
                        </h2>
                    </div>

                    <div className="w-full flex justify-center">
                        {currentQuestion.type === "number" && (
                            <input
                                className="w-full p-4 border border-gray-300 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200"
                                type="number"
                                placeholder="Enter a number..."
                                value={typeof value === "string" ? value : ""}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        )}

                        {currentQuestion.type === "select" && (
                            <select
                                className="w-full p-4 border border-gray-300 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer transition-all duration-200"
                                value={typeof value === "string" ? value : ""}
                                onChange={(e) => setValue(e.target.value)}
                            >
                                <option value="" disabled>Select an option...</option>
                                {currentQuestion?.options?.map(option => (
                                    <option
                                        key={option}
                                        value={option}
                                        className="bg-background text-foreground"
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}

                        {currentQuestion.type === "multiselect" && (
                            <MultiSelectDropdown
                                options={currentQuestion.options || []}
                                selectedValues={Array.isArray(value) ? value : []}
                                onChange={(newValues) => setValue(newValues)}
                                placeholder="Select options..."
                            />
                        )}
                    </div>

                    <div className="flex gap-4 w-full mt-4 justify-end">
                        {step > 0 && (
                            <Button
                                text="Back"
                                onClick={backQuestion}
                            />
                        )}
                        <Button
                            text="Next"
                            onClick={nextQuestion}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden fixed bottom-0 ">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Quiz;
