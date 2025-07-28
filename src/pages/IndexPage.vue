<template>
  <q-page padding>
    <div class="tw-max-w-[1000px] tw-mx-auto">
      <h1 class="tw-text-4xl tw-my-5 lg:tw-text-start tw-text-center">
        Добавить задачу
      </h1>
      <!-- Форма для добавления задачи -->
      <q-form @submit.prevent="handleAddTask" class="q-mb-md">
        <q-input v-model="newTask.title" label="Название" outlined dense />
        <q-input
          v-model="newTask.description"
          label="Описание"
          type="textarea"
          outlined
          dense
          class="q-mt-sm"
        />
        <q-input
          v-model="newTask.dueDate"
          label="Срок выполнения"
          type="date"
          :min="today"
          :rules="[(val) => val >= today! || 'Нельзя выбрать прошедшую дату']"
          outlined
          dense
          class="q-mt-sm"
        />
        <q-select
          v-model="newTask.status"
          :options="statusOptions"
          label="Статус"
          outlined
          dense
          class="q-mt-sm"
        />
        <q-btn
          type="submit"
          label="Добавить задачу"
          color="red-14"
          class="q-mt-md tw-mx-auto tw-block"
        />
      </q-form>

      <!-- Список задач -->
      <div
        v-if="taskStore.isLoading"
        class="tw-flex tw-justify-center tw-mt-10"
      >
        <q-spinner-dots color="red-14" size="40px" />
      </div>
      <q-list v-else bordered separator>
        <!-- Добавлен cursor-pointer и обработчик клика для открытия модального окна -->
        <q-item
          v-for="(task, index) in taskStore.tasks"
          :key="task.id ?? index"
          clickable
          v-ripple
          @click="openEditModal(task)"
        >
          <q-item-section>
            <q-item-label>{{ task.title }}</q-item-label>
            <q-item-label caption>{{ task.description }}</q-item-label>
            <q-item-label caption>
              Срок: {{ new Date(task.dueDate as Date).toLocaleDateString() }}
            </q-item-label>
          </q-item-section>

          <!-- Этот q-select теперь просто индикатор, для редактирования используется модальное окно -->
          <q-item-section side>
            <q-chip
              dense
              :color="getStatusColor(task.status.value)"
              text-color="white"
            >
              {{ task.status.label }}
            </q-chip>
          </q-item-section>

          <q-item-section side>
            <q-btn
              @click.stop="taskStore.deleteTask(task.id!)"
              flat
              round
              dense
              color="negative"
              icon="delete"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div
        v-if="!taskStore.isLoading && taskStore.tasks.length === 0"
        class="text-center text-grey q-mt-lg"
      >
        У вас пока нет задач.
      </div>

      <!-- Модальное окно для редактирования задачи -->
      <q-dialog v-model="isEditModalOpen">
        <q-card style="width: 500px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6">Редактировать задачу</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit.prevent="handleUpdateTask">
              <q-input
                v-model="taskToEdit.title"
                label="Название"
                outlined
                dense
              />
              <q-input
                v-model="taskToEdit.description"
                label="Описание"
                type="textarea"
                outlined
                dense
                class="q-mt-sm"
              />
              <q-input
                v-model="taskToEdit.dueDate"
                label="Срок выполнения"
                type="date"
                :min="today"
                :rules="[
                  (val) => val >= today! || 'Нельзя выбрать прошедшую дату',
                ]"
                outlined
                dense
                class="q-mt-sm"
              />
              <q-select
                v-model="taskToEdit.status"
                :options="statusOptions"
                label="Статус"
                outlined
                dense
                class="q-mt-sm"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Отмена" color="primary" v-close-popup />
            <q-btn
              flat
              label="Сохранить"
              color="primary"
              @click="handleUpdateTask"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';
import {
  useTaskStore,
  type Task,
  type TaskStatus,
} from 'src/stores/task-store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const taskStore = useTaskStore();

// --- Состояние для формы добавления ---
const today = new Date().toISOString().split('T')[0];
const statusOptions = [
  { label: 'Не начата', value: 'not_started' },
  { label: 'В процессе', value: 'in_progress' },
  { label: 'Завершена', value: 'completed' },
];

const newTask = ref({
  title: '',
  description: '',
  dueDate: today,
  status: statusOptions[0] as TaskStatus,
});

const handleAddTask = async () => {
  if (!newTask.value.title.trim()) return;

  const taskPayload = {
    ...newTask.value,
    description: newTask.value.description.trim(),
    dueDate: new Date(newTask.value.dueDate!),
  };

  await taskStore.addTask(taskPayload);

  newTask.value = {
    title: '',
    description: '',
    dueDate: today,
    status: statusOptions[0] as TaskStatus,
  };
};

// --- Состояние и логика для модального окна редактирования ---
const isEditModalOpen = ref(false);
const taskToEdit = ref({
  id: '',
  title: '',
  description: '',
  dueDate: '',
  status: statusOptions[0] as TaskStatus,
});

const openEditModal = (task: Task) => {
  taskToEdit.value = {
    id: task.id!,
    title: task.title,
    description: task.description,
    // Преобразуем Date в строку 'YYYY-MM-DD' для q-input
    dueDate: new Date(task.dueDate as Date).toISOString().split('T')[0]!,
    status: task.status,
  };
  isEditModalOpen.value = true;
};

const handleUpdateTask = async () => {
  const { id, ...updates } = taskToEdit.value;

  if (!updates.title.trim()) return;

  const payload = {
    ...updates,
    dueDate: new Date(updates.dueDate),
  };

  await taskStore.updateTask(id, payload);
  isEditModalOpen.value = false;
};

const getStatusColor = (statusValue: string) => {
  switch (statusValue) {
    case 'not_started':
      return 'grey';
    case 'in_progress':
      return 'blue';
    case 'completed':
      return 'green';
    default:
      return 'primary';
  }
};

// --- Хук жизненного цикла ---
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.replace('/login');
    return; // Прерываем выполнение, если пользователя нет
  }

  // Загружаем задачи, если они еще не были загружены
  if (taskStore.tasks.length === 0) {
    taskStore.fetchTasks();
  }
});
</script>
