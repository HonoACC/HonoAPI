import React, { useRef, useEffect, useCallback } from 'react';

const Counter = ({ end, suffix = '', prefix = '', duration = 1600, decimals = 0 }) => {
  const ref = useRef(null);
  const startedRef = useRef(false);

  const formatValue = useCallback(
    (v) => (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()),
    [decimals]
  );

  const animate = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${formatValue(eased * end)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, prefix, suffix, formatValue]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.textContent = `${prefix}${formatValue(end)}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          animate();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, end, prefix, suffix, formatValue]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}0{suffix}
    </span>
  );
};

export default Counter;
