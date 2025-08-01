import { Fragment, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/shallow';
import { showToast } from '@utils/toast';
import { ModalBase } from '@common/ui/layout/ModalBase';

import { useModalsStore } from '@store/modalsStore';
import {
  updateUser,
  confirmUpdate,
  updateSchema,
  useUserStore,
} from '@features/user';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';

export function UpdateUserModal() {
  const [load, setLoad] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmationCode, setConfirmationCode] = useState('');

  const [newLogin, setNewLogin] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [originalLogin, setOriginalLogin] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      setNewLogin(user.login);
      setNewEmail(user.email);
      setOriginalLogin(user.login || '');
      setOriginalEmail(user.email || '');
    }
  }, [user]);

  const { isUpdateUserModalOpen, setIsUpdateUserModalOpen } = useModalsStore(
    useShallow((state) => ({
      isUpdateUserModalOpen: state.isUpdateUserModalOpen,
      setIsUpdateUserModalOpen: state.setIsUpdateUserModalOpen,
    })),
  );

  const handleClose = () => {
    setIsUpdateUserModalOpen(false);
  };

  const sendEmailHandler = async () => {
    setLoad(true);
    try {
      const success = await confirmUpdate();
      if (success) {
        setStep(2);
      }
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
    } finally {
      setLoad(false);
    }
  };

  const updateUserHandler = async () => {
    const code = confirmationCode;
    if (newLogin === originalLogin && newEmail === originalEmail) {
      showToast('Нет изменений для сохранения', 'info');
      return;
    }
    try {
      await updateSchema.validate({
        confirmationCode: code,
        email: newEmail,
        login: newLogin,
      });
    } catch (err) {
      showToast(err.message || 'Ошибка валидации', 'error');
      return;
    }

    try {
      setLoad(true);
      const success = await updateUser(code, {
        ...(newLogin?.trim() ? { login: newLogin.trim() } : {}),
      });
      if (success) {
        setStep(3);
        setTimeout(() => {
          handleClose();
          setStep(1);
        }, 4000);
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <ModalBase
      open={isUpdateUserModalOpen}
      onClose={handleClose}
      disableOverlayClose={true}
    >
      <h2 className="text-3xl text-center mb-8">Обновление данных</h2>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1-motion"
            initial={{ opacity: 1, transform: 'translateX(0px)' }}
            animate={{ opacity: 1, transform: 'translateX(0px)' }}
            exit={{ opacity: 0, transform: 'translateX(-50px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Step1
              loading={load}
              onCancel={handleClose}
              onConfirm={sendEmailHandler}
            />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2-motion"
            initial={{
              opacity: 0,
              transform: 'translateX(50px)',
            }}
            animate={{ opacity: 1, transform: 'translateX(0px)' }}
            exit={{ opacity: 0, transform: 'translateX(-50px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Step2
              loading={load}
              confirmationCode={confirmationCode}
              onCodeChange={(e) => setConfirmationCode(e.target.value)}
              onUpdate={updateUserHandler}
              onCancel={handleClose}
              newLogin={newLogin}
              onLoginChange={(e) => setNewLogin(e.target.value)}
              newEmail={newEmail}
              onEmailChange={(e) => setNewEmail(e.target.value)}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step3-motion"
            initial={{ opacity: 0, transform: 'translateX(50px)' }}
            animate={{ opacity: 1, transform: 'translateX(0)' }}
            exit={{ opacity: 0, transform: 'translateX(-50px)' }}
          >
            <Step3 />
          </motion.div>
        )}
      </AnimatePresence>
    </ModalBase>
  );
}
