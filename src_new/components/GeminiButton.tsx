import React, { useState } from 'react';

interface GeminiButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
}

export const GeminiButton: React.FC<GeminiButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    type = 'button',
    fullWidth = false,
}) => {
    const [isPinging, setIsPinging] = useState(false);

    const handleClick = () => {
        if (disabled || !onClick) return;

        // Trigger ping animation
        setIsPinging(true);
        setTimeout(() => setIsPinging(false), 600);

        onClick();
    };

    const sizeClasses = {
        sm: 'gemini-button-sm text-sm',
        md: 'text-base',
        lg: 'gemini-button-lg text-lg',
    };

    const variantClasses = {
        primary: 'gemini-button',
        secondary: 'gemini-button opacity-80',
        danger: 'gemini-button border-red-500/30',
    };

    return (
        <div
            className={`gemini-ring-wrapper ${fullWidth ? 'w-full' : 'inline-block'} ${disabled ? 'disabled' : ''} ${isPinging ? 'gemini-ping' : ''}`}
        >
            <div className="gemini-ring"></div>
            <button
                type={type}
                onClick={handleClick}
                disabled={disabled}
                className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
            >
                {children}
            </button>
        </div>
    );
};

// Gemini Card Wrapper Component
interface GeminiCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const GeminiCard: React.FC<GeminiCardProps> = ({
    children,
    className = '',
    onClick,
}) => {
    return (
        <div
            className={`gemini-card-wrapper ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="gemini-card-ring"></div>
            <div className={`relative z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
};
