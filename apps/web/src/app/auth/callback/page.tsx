'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGoogleCode } from '../../../lib/api';
import { Mascot } from '../../../components/mascot/Mascot';
import { Button } from '../../../components/ui/Button';

function CallbackContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`Google kirish bekor qilindi: ${errorParam}`);
      return;
    }

    if (!code) {
      setError('Google tomonidan tasdiqlash kodi yuborilmadi.');
      return;
    }

    async function handleExchange(): Promise<void> {
      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        await loginWithGoogleCode(code!, redirectUri);

        const target = sessionStorage.getItem('pley_post_login_redirect') || '/discover';
        sessionStorage.removeItem('pley_post_login_redirect');
        router.push(target);
      } catch (err: any) {
        setError(err.message || 'Google hisobi bilan tizimga kirishda xatolik yuz berdi');
      }
    }

    handleExchange();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border-[2.5px] border-[#242424] rounded-3xl shadow-[4px_4px_0px_#242424] text-center space-y-4">
        <Mascot size="lg" mood="sleepy" />
        <h2 className="text-xl font-black text-[#242424]">Kirish amalga oshmadi</h2>
        <p className="text-xs font-semibold text-[#FF795D]">{error}</p>
        <Button variant="lime" size="sm" onClick={() => router.push('/')}>
          Bosh sahifaga qaytish
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-24 p-8 text-center space-y-4">
      <Mascot size="lg" mood="bouncing" className="animate-bounce" />
      <h2 className="text-2xl font-black text-[#242424]">
        Google orqali kirilmoqda...
      </h2>
      <p className="text-xs font-bold text-[#666666]">
        Iltimos kuting, profilingiz tayyorlanmoqda.
      </p>
    </div>
  );
}

export default function GoogleCallbackPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto my-24 text-center">
          <Mascot size="md" mood="bouncing" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

