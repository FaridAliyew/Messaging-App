import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, charCount, maxLength, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-muted"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          className={[
            'block w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-foreground',
            'placeholder:text-faint resize-none',
            'transition-colors duration-150',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
            'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted',
            error ? 'border-danger/60 focus:border-danger focus:ring-danger' : 'border-border',
            className,
          ].join(' ')}
          {...props}
        />
        <div className="flex items-start justify-between gap-2">
          <div>
            {error && <p className="text-xs text-danger">{error}</p>}
            {hint && !error && <p className="text-[11px] text-faint">{hint}</p>}
          </div>
          {maxLength !== undefined && charCount !== undefined && (
            <span className="shrink-0 font-mono text-[10px] text-faint">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
