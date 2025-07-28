import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { firebaseAuth } from 'boot/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from 'firebase/auth';
import { Cookies, Notify } from 'quasar';

import { useTaskStore } from './task-store';

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null);

  const isLoading = ref<boolean>(false);

  const isAuthenticated = computed<boolean>(() => !!user.value);
  const userId = computed<string | null>(() => user.value?.uid ?? null);

  /**
   * Слушает изменения состояния аутентификации от Firebase
   * и обновляет состояние в Pinia.
   */
  const listenForAuthChanges = () => {
    isLoading.value = true;
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      user.value = currentUser;
      isLoading.value = false;

      const taskStore = useTaskStore();
      if (currentUser) {
        taskStore.fetchTasks();
      } else {
        taskStore.clearTasks();
      }
    });
  };

  /**
   * Регистрирует нового пользователя
   */
  const register = async (email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const accessToken = await response.user.getIdToken();

      Cookies.set('accessToken', accessToken, {
        expires: 7,
      });

      Notify.create({
        type: 'positive',
        message: 'Регистрация прошла успешно!',
      });
    } catch (e) {
      const error = e as AuthError;

      if (error.message === 'EMAIL_EXISTS') {
        Notify.create({
          type: 'negative',
          message: 'Пользователь с таким email уже существует.',
        });
        return;
      }

      Notify.create({ type: 'negative', message: error.message });
      console.error('Ошибка регистрации:', error.code);
    }
  };

  /**
   * Осуществляет вход пользователя
   */
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      Notify.create({ type: 'positive', message: 'Вход выполнен успешно!' });
    } catch (e) {
      const error = e as AuthError;

      if (error.message === 'INVALID_LOGIN_CREDENTIALS') {
        Notify.create({
          type: 'negative',
          message: 'Неверный email или пароль.',
        });
        return;
      }

      Notify.create({
        type: 'negative',
        message: 'Произошла ошибка при входе.',
      });
      console.error('Ошибка входа:', error.code);
    }
  };

  /**
   * Осуществляет выход пользователя
   */
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      Notify.create({ message: 'Вы вышли из системы' });

      const taskStore = useTaskStore();
      taskStore.clearTasks();
    } catch (e) {
      const error = e as AuthError;
      Notify.create({ type: 'negative', message: 'Ошибка при выходе' });
      console.error('Ошибка выхода:', error.code);
    }
  };

  return {
    user,
    isLoading,

    isAuthenticated,
    userId,

    listenForAuthChanges,
    register,
    login,
    logout,
  };
});
