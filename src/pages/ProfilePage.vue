<template>
  <q-page>
    <div class="tw-container">
      <h1 class="tw-text-2xl md:tw-text-5xl tw-text-center tw-py-5">
        Профиль пользователя
      </h1>

      <div
        class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 sm:lg:tw-gap-2 lg:tw-gap-6 tw-max-w-[900px] tw-mx-auto"
      >
        <div
          class="tw-flex tw-flex-col tw-items-center md:tw-max-w-72 tw-mx-auto md:tw-mx-0 tw-max-w-full tw-w-full"
        >
          <q-input
            :model-value="email ?? 'Не указано'"
            label="Email"
            type="email"
            :readonly="!!email"
            class="tw-mb-5 tw-w-full"
          />
          <q-input
            :model-value="phoneNumber ?? 'Не указано'"
            label="Номер телефона"
            type="tel"
            :readonly="!!phoneNumber"
            class="tw-mb-5 tw-w-full"
          />
        </div>
        <div
          class="tw-flex tw-flex-col tw-items-center md:tw-max-w-72 tw-mx-auto md:tw-mx-0 tw-max-w-full tw-w-full"
        >
          <q-input
            :model-value="userName ?? 'Не указано'"
            label="Имя"
            type="text"
            :readonly="!!userName"
            class="tw-mb-5 tw-w-full"
          />
          <q-btn
            class="tw-w-full tw-mt-6"
            color="red-14"
            label="Изменить профиль"
            @click="
              $q.notify({
                message: 'Функция изменения профиля в разработке',
                color: 'orange',
              })
            "
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.replace('/login');
  }
});

const $q = useQuasar();

const email = ref(authStore.user?.email);
const userName = ref(authStore.user?.displayName);
const phoneNumber = ref(authStore.user?.phoneNumber);
</script>
