import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { db } from 'boot/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { useAuthStore } from './auth-store';
import { Notify } from 'quasar';

export interface TaskStatus {
  label: string;
  value: string;
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Date | Timestamp;
  status: TaskStatus;
  userId?: string;
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks: Ref<Task[]> = ref([]);
  const isLoading = ref<boolean>(false);
  const authStore = useAuthStore();

  // Переменная для хранения функции отписки от слушателя Firestore
  let unsubscribeFromTasks: (() => void) | null = null;

  /**
   * Получение задач для текущего пользователя в реальном времени.
   */
  const fetchTasks = () => {
    // Если уже есть активная подписка, отключаем ее, чтобы избежать дублей
    if (unsubscribeFromTasks) {
      unsubscribeFromTasks();
    }

    if (!authStore.userId) {
      tasks.value = []; // Очищаем задачи, если пользователя нет
      return;
    }

    isLoading.value = true;
    const tasksCollection = collection(db, 'tasks');
    const q = query(
      tasksCollection,
      where('userId', '==', authStore.userId),
      orderBy('dueDate', 'asc'), // Сортируем по сроку выполнения
    );

    // onSnapshot слушает изменения в реальном времени
    unsubscribeFromTasks = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedTasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTasks.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            // Firestore возвращает Timestamp, его нужно конвертировать в Date
            dueDate: (data.dueDate as Timestamp).toDate(),
            status: data.status,
          });
        });
        tasks.value = fetchedTasks;
        isLoading.value = false;
      },
      (error) => {
        Notify.create({
          type: 'negative',
          message: 'Ошибка при загрузке задач.',
        });
        console.error('Ошибка получения задач:', error);
        isLoading.value = false;
      },
    );
  };

  /**
   * Добавление новой задачи в Firestore
   */
  const addTask = async (task: Omit<Task, 'id' | 'userId'>) => {
    if (!authStore.userId) {
      Notify.create({ type: 'negative', message: 'Вы не авторизованы' });
      return;
    }
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        userId: authStore.userId,
        // Преобразуем Date в Firestore Timestamp для правильного хранения
        dueDate: Timestamp.fromDate(task.dueDate as Date),
      });
      Notify.create({ type: 'positive', message: 'Задача добавлена!' });
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Ошибка при добавлении задачи',
      });
      console.error('Ошибка добавления задачи:', error);
    }
  };

  /**
   * Обновление существующей задачи
   */
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      // Если обновляем дату, конвертируем ее в Timestamp
      if (updates.dueDate) {
        updates.dueDate = Timestamp.fromDate(updates.dueDate as Date);
      }
      await updateDoc(taskRef, updates);
      Notify.create({ message: 'Задача обновлена' });
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Ошибка при обновлении задачи',
      });
      console.error('Ошибка обновления задачи:', error);
    }
  };

  /**
   * Удаление задачи
   */
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      Notify.create({ message: 'Задача удалена' });
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Ошибка при удалении задачи',
      });
      console.error('Ошибка удаления задачи:', error);
    }
  };

  /**
   * Очистка данных при выходе пользователя
   */
  const clearTasks = () => {
    tasks.value = [];
    if (unsubscribeFromTasks) {
      unsubscribeFromTasks();
      unsubscribeFromTasks = null;
    }
  };

  return {
    tasks,
    isLoading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    clearTasks,
  };
});
