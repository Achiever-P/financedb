import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FloatingPopover({ triggerRef, onClose, children, align = 'left' }) {
  const [pos, setPos] = useState(null);
  const popRef = useRef();

  useEffect(() => {
    if (!triggerRef?.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vpW  = window.innerWidth;
    const vpH  = window.innerHeight;
    const isMobile = vpW < 640;
    if (isMobile) {
      setPos({ top: rect.bottom + 6, left: 16, right: 16, centered: true });
    } else {
      setPos({
        top:  Math.min(rect.bottom + 6, vpH - 320),
        ...(align === 'right' ? { right: vpW - rect.right } : { left: rect.left }),
        centered: false,
      });
    }
  }, [triggerRef, align]);

  useEffect(() => {
    const fn = (e) => {
      if (popRef.current && !popRef.current.contains(e.target) && triggerRef?.current && !triggerRef.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', fn), 0);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!pos) return null;

  const style = {
    position: 'fixed',
    top: pos.top,
    zIndex: 9999,
    animation: 'fadeSlideDown .15s ease',
    ...(pos.centered
      ? { left: pos.left, right: pos.right }
      : pos.right !== undefined
        ? { right: pos.right, minWidth: 210 }
        : { left: pos.left,  minWidth: 210 }),
  };

  return createPortal(
    <div ref={popRef} style={style}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}>
      {children}
    </div>,
    document.body
  );
}
