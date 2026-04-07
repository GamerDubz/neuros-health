"use client";

import { useState } from "react";
import type { DrugDetail } from "@/lib/db/drug-detail";

export function TeachBackQuizModal({
  quiz,
  onClose,
}: {
  quiz: NonNullable<DrugDetail["teach_back_quiz"]>;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const options = quiz.options || [];
  const correctIndex = typeof quiz.correct_index === 'number' ? quiz.correct_index : -1;
  const correct = answered && picked === correctIndex && correctIndex < options.length;

  // Nothing to show if the quiz is incomplete
  if (!quiz.question || options.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Quick Check</p>
        <p className="text-lg font-bold text-on-surface leading-snug">{quiz.question}</p>
        <div className="space-y-2">
          {options.map((option, index) => {
            const isCorrect = index === correctIndex && correctIndex < options.length;
            const isPicked = index === picked;
            const baseClassName =
              "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-colors";
            const colorClassName = !answered
              ? "border-surface-container-high text-on-surface hover:border-primary"
              : isCorrect
                ? "border-[#22c55e] bg-[#dcfce7] text-[#166534]"
                : isPicked
                  ? "border-error bg-error-container text-on-error-container"
                  : "border-surface-container-high text-on-surface-variant opacity-60";

            return (
              <button
                key={index}
                disabled={answered}
                onClick={() => setPicked(index)}
                className={`${baseClassName} ${colorClassName}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`rounded-xl p-4 ${correct ? "bg-[#dcfce7]" : "bg-[#fef9c3]"}`}>
            <p className="text-sm font-bold mb-1 inline-flex items-center gap-1">
              {correct && (
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  check_circle
                </span>
              )}
              {correct ? "Nice one!" : "Good try!"}
            </p>
            <p className="text-sm text-on-surface-variant">{quiz.explanation}</p>
          </div>
        )}
        <button onClick={onClose} className="w-full h-12 bg-primary text-white rounded-full font-bold text-sm">
          {answered ? "Done" : "Skip"}
        </button>
      </div>
    </div>
  );
}
