"use client";
import { questions } from "../data/questions";
import { useEffect, useState } from "react";
import Button from "../components/button";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnimation from "../components/VoiceAnimation";
import Link from "next/link";
import Logo from "../components/logo";

const Aiquiz = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [value, setValue] = useState("");
    const [direction, setDirection] = useState(0);
    const [isListening, setIsListening] = useState(false);

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
    const progress = currentQuestion ? ((step + 1) / questions.length) * 100 : 100;

    // Sync value with the current question
    useEffect(() => {
        if (!currentQuestion) return;

        if (answers[currentQuestion.id] !== undefined) {
            setValue(answers[currentQuestion.id]);
        } else {
            setValue(currentQuestion.type === "multiselect" ? [] : "");
        }
    }, [step, currentQuestion, answers]);

    function speak(text) {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);

        const setVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
                speech.voice = voices[2] || voices[0];
            }
            speech.rate = 0.9;
            speech.pitch = 1.1;
            speech.lang = "en-US";
            speech.onend = () => {
                listen();
            };
            window.speechSynthesis.speak(speech);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
        } else {
            setVoiceAndSpeak();
        }
    }


    useEffect(() => {
        if (!currentQuestion) return;

        const timer = setTimeout(() => {
            speak(currentQuestion.question);
        }, 600);

        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [step]);

    function listen() {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const answer = event.results[0][0].transcript;
            console.log(answer);
            setValue(answer);
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: answer
            }));
        };

        recognition.start();
    }

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
            <div className=" absolute top-5 right-5 z-50 text-sm ">
                <Link href="/manual-quiz">
                    <Button text="Fill Manually" />
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

                    <div className="w-full flex justify-center flex-col gap-4">
                        <div className="flex gap-4 justify-center">
                            <Button
                                text="Speak Question"
                                onClick={() => speak(currentQuestion.question)}
                            />
                            <Button
                                text={isListening ? "Listening..." : "Voice Answer"}
                                onClick={listen}
                            />
                        </div>

                        <div className="w-full text-center min-h-[60px] flex items-center justify-center">
                            {isListening && (
                                <div className="flex items-center gap-2">
                                    <p>Listening...</p>
                                    <VoiceAnimation />
                                </div>
                            )}
                            {!isListening && value && (
                                <p className="text-lg font-semibold text-amber-700 bg-amber-700/10 py-2.5 px-5 rounded-lg">
                                    Heard: "{value}"
                                </p>
                            )}
                            {!isListening && !value && (
                                <p className="text-gray-400 dark:text-zinc-500 italic">
                                    Click "Voice Answer" to reply using speech
                                </p>
                            )}
                        </div>
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

export default Aiquiz;