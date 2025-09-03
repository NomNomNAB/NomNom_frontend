import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	children: React.ReactNode;
	className?: string;
}

const Form: React.FC<FormProps> = ({ children, className = '', ...props }) => {
	return (
		<form className={`space-y-4 ${className}`} {...props}>
			{children}
		</form>
	);
};

export default Form;
