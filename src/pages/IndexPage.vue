<template>
  <q-page padding>
    <div class="tw-max-w-[1000px] tw-mx-auto tw-px-3 md:tw-px-0">
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

      <!-- Панель управления: Фильтрация и Сортировка -->
      <div
        class="tw-flex tw-flex-wrap tw-justify-between tw-items-baseline tw-mb-5 tw-gap-y-5"
      >
        <!-- Фильтрация -->
        <q-btn-group class="tw-mx-auto lg:tw-mx-0">
          <q-btn
            :color="filterByStatus === 'all' ? 'red-14' : 'grey-14'"
            label="Все"
            @click="filterByStatus = 'all'"
            class="tw-text-[11px] md:tw-text-sm"
          />
          <q-btn
            v-for="status in statusOptions"
            :key="status.value"
            @click="filterByStatus = status.value as typeof filterByStatus"
            :color="filterByStatus === status.value ? 'red-14' : 'grey-14'"
            :label="status.label"
            class="tw-text-[11px] md:tw-text-sm"
          />
        </q-btn-group>

        <!-- Сортировка -->
        <q-btn-toggle
          v-model="sortByDueDate"
          class="tw-text-[11px] md:tw-text-sm tw-mx-auto md:tw-mx-0"
          :options="[
            { label: 'Сначала старые', value: 'asc' },
            { label: 'Сначала новые', value: 'desc' },
          ]"
        />
      </div>

      <!-- Список задач -->
      <div
        v-if="taskStore.isLoading"
        class="tw-flex tw-justify-center tw-mt-10"
      >
        <q-spinner-dots color="red-14" size="40px" />
      </div>
      <!-- Используем НОВОЕ computed свойство filteredAndSortedTasks -->
      <q-list
        class="tw-mb-4"
        v-else-if="filteredAndSortedTasks.length > 0"
        bordered
        separator
      >
        <q-item
          v-for="(task, index) in filteredAndSortedTasks"
          :key="task.id ?? index"
          clickable
          v-ripple
          @click="openEditModal(task)"
        >
          <!-- ... секции q-item без изменений ... -->
          <q-item-section>
            <q-item-label class="tw-truncate">{{ task.title }}</q-item-label>
            <q-item-label class="tw-truncate" caption>{{
              task.description
            }}</q-item-label>
            <q-item-label caption>
              Срок: {{ new Date(task.dueDate as Date).toLocaleDateString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip
              class="tw-text-xs"
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

      <div v-else class="text-center text-grey q-mt-lg">
        <p v-if="taskStore.tasks.length === 0">У вас пока нет задач.</p>
        <p v-else>Нет задач, соответствующих вашему фильтру.</p>
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
import { computed, onMounted, ref } from 'vue';
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
  if (!newTask.value.title.trim() || !newTask.value.description.trim()) return;

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

// --- Состояние для фильтрации и сортировки ---
const filterByStatus = ref<'all' | 'not_started' | 'in_progress' | 'completed'>(
  'all',
);
const sortByDueDate = ref<'asc' | 'desc'>('asc'); // 'asc' - сначала старые, 'desc' - сначала новые

const filteredAndSortedTasks = computed(() => {
  // 1. Фильтрация
  const filtered = taskStore.tasks.filter((task) => {
    if (filterByStatus.value === 'all') {
      return true; // Показываем все задачи
    }
    return task.status.value === filterByStatus.value;
  });

  // 2. Сортировка
  return filtered.sort((a, b) => {
    const dateA = new Date(a.dueDate as Date).getTime();
    const dateB = new Date(b.dueDate as Date).getTime();
    return sortByDueDate.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
});

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

  if (!updates.title.trim() || !updates.description.trim()) return;

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
