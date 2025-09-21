import React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1 w-full">
				{label && (
					<label className="font-medium text-sm sm:text-md text-black">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={`w-full px-3 py-2 border rounded-lg transition ${error ? 'border-red-500' : 'border-[#B3B3B3]'} ${className}`}
					{...props}
				/>
				{error && (
					<span className="text-xs text-red-500">{error}</span>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;