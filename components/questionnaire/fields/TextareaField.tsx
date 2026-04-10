"use client";

import type { TextareaQuestion } from "@/lib/questionnaire.types";
import { QuestionBlock } from "../QuestionBlock";

type Props = {
  question: TextareaQuestion;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onBlurField?: () => void;
};

export function TextareaField({ question, value, onChange, error, onBlurField }: Props) {
  const invalid = Boolean(error);
  return (
    <QuestionBlock order={question.order} label={question.label} description={question.description}>
      <div className="relative w-full">
        <textarea
          id={question.id}
          name={question.id}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${question.id}-error` : undefined}
          className={`box-border w-full min-h-[52px] resize-y rounded-2xl border bg-white px-3.5 py-2.5 font-sans text-xs leading-normal text-[#0C1A3A] placeholder:text-slate-400/70 focus:outline-none ${
            invalid
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300/60 focus:border-sky-500"
          }`}
          placeholder={question.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlurField}
          rows={question.rows ?? 3}
          autoComplete="off"
        />
        {error ? (
          <p id={`${question.id}-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </QuestionBlock>
  );
}
