import React, { useState, useEffect, useRef } from 'react';

export const ShinyText = ({ text, disabled = false, speed = 4, className = '' }) => {
    const animationDuration = `${speed}s`;
    return (
        <span
            className={`inline-block text-teal-400 bg-clip-text ${disabled ? '' : 'animate-rb-shine'} ${className}`}
            style={{
                backgroundImage:
                    'linear-gradient(120deg, rgba(45, 212, 191, 0.9) 35%, rgba(255, 255, 255, 1) 50%, rgba(45, 212, 191, 0.9) 65%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animationDuration,
            }}
        >
            {text}
        </span>
    );
};

export const GradientText = ({
    children,
    className = '',
    colors = ['#14b8a6', '#0ea5e9', '#10b981', '#14b8a6'],
}) => {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    };

    return (
        <span
            className={`inline-block text-transparent bg-clip-text animate-rb-gradient ${className}`}
            style={gradientStyle}
        >
            {children}
        </span>
    );
};

export const BlurText = ({ text = '', delay = 50, className = '' }) => {
    const elements = text.split(' ');
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
            {elements.map((el, index) => (
                <span
                    key={index}
                    style={{ transitionDelay: `${index * delay}ms` }}
                    className={`inline-block transition-all duration-500 ease-out ${
                        inView ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-3 blur-sm'
                    }`}
                >
                    {el}
                    {index < elements.length - 1 ? '\u00A0' : ''}
                </span>
            ))}
        </span>
    );
};

export const SpotlightCard = ({
    children,
    className = '',
    spotlightColor = 'rgba(20, 184, 166, 0.16)',
    onClick,
}) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative rounded-2xl border border-white/10 bg-[#0d1219]/90 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-primary/35 ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-500 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};

