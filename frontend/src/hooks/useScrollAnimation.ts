import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(options?: {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: string;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = options?.from ?? { opacity: 0, y: 40 };
    const to = options?.to ?? { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' };

    gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: options?.start ?? 'top 85%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return ref;
}
