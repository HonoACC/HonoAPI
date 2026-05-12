import React, { useRef, useEffect, useState } from 'react';

const animations = {
  'fade-up': {
    from: { opacity: 0, transform: 'translateY(24px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'scale-in': {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  'fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

const AnimateInView = ({ children, animation = 'fade-up', delay = 0, className = '', style = {} }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = animations[animation] || animations['fade-up'];
  const currentStyle = isVisible ? anim.to : anim.from;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...currentStyle,
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimateInView;
