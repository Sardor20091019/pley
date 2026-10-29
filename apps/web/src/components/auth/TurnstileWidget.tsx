'use client';

import React, { useEffect, useRef } from 'react';

export interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  className = '',
  theme = 'auto',
}: TurnstileWidgetProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || '0x4AAAAAAFpYVK4Lc7_KcYai';

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const renderWidget = (): void => {
      const turnstile = (window as any).turnstile;
      if (!turnstile || !containerRef.current || widgetIdRef.current || !isMounted) {
        return;
      }

      try {
        containerRef.current.innerHTML = '';
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          'refresh-expired': 'auto',
          callback: (token: string) => {
            if (isMounted) {
              onVerifyRef.current(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              onExpireRef.current?.();
            }
          },
          'error-callback': (errorCode?: string) => {
            if (isMounted) {
              onErrorRef.current?.(errorCode);
            }
          },
          'timeout-callback': () => {
            if (isMounted) {
              onErrorRef.current?.('timeout');
            }
          },
        });
      } catch {
        if (isMounted) {
          onErrorRef.current?.('render_error');
        }
      }
    };

    let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const turnstile = (window as any).turnstile;
    if (turnstile && typeof turnstile.ready === 'function') {
      turnstile.ready(renderWidget);
    } else {
      timer = setInterval(() => {
        const t = (window as any).turnstile;
        if (t) {
          if (timer) clearInterval(timer);
          renderWidget();
        }
      }, 100);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
      }
      const t = (window as any).turnstile;
      if (t && widgetIdRef.current) {
        try {
          t.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme]);

  return (
    <div className={`flex justify-center items-center min-h-[65px] my-3 ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}

