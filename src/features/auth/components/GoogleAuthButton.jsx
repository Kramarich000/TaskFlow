import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '@features/auth/api/google/connect/googleAuth';
import { useUserStore } from '@features/user';
import { useAuthStore } from '@features/auth/store';
import { showToast } from '@utils/toast';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@common/ui/utilities/Button';
import { useState } from 'react';
import { AiOutlineSync } from 'react-icons/ai';
import { useModalsStore } from '@store/modalsStore';
import { googleConnect } from '@features/auth/api/google/connect/googleConnect';

export function GoogleAuthButton({
  btnText = '',
  isAuth = true,
  isNavigated = true,
  googleLoad,
  setGoogleLoad,
  disabled,
}) {
  const navigate = useNavigate();
  const { setUser } = useUserStore.getState();
  const { setAccessToken } = useAuthStore.getState();

  const setIsConnectGoogleModalOpen = useModalsStore(
    (state) => state.setIsConnectGoogleModalOpen,
  );

  const login = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid profile email',
    redirect_uri: 'postmessage',
    onError: () => showToast('Ошибка входа через Google'),
    onSuccess: async (codeResponse) => {
      setGoogleLoad(true);
      try {
        const { code } = codeResponse;
        if (!code) {
          showToast('Не удалось получить код от Google');
          return;
        }

        const response = isAuth
          ? await googleAuth(code)
          : await googleConnect(code);

        const result = response?.data ?? response;

        if (result.accessToken) {
          setAccessToken(result.accessToken);
          // setUser({ login: result.login, email: result.email, avatarUrl: result.avatarUrl });
          if (isNavigated) navigate('/dashboard');
        } else if (result.requireEmailConfirmed) {
          console.log("ifasfaafa")
          setIsConnectGoogleModalOpen(true);
        } else {
          showToast('Сервер не вернул токен');
        }
      } catch (err) {
        console.error(err);
        showToast('Ошибка при обработке Google-кода');
      } finally {
        setGoogleLoad(false);
      }
    },
  });

  return (
    <Button
      onClick={() => login()}
      variant="primary"
      type="button"
      disabled={disabled}
    >
      {googleLoad ? (
        <AiOutlineSync size={23} className="animate-spin" />
      ) : (
        <>
          <FcGoogle size={20} className="!bg-white !rounded-full" />
          {btnText || 'Войти через Google'}
        </>
      )}
    </Button>
  );
}
