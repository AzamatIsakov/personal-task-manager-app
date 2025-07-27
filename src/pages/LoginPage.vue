<template>
  <div class="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
    <q-card
      class="tw-relative tw-w-full tw-max-w-[300px] sm:tw-max-w-md tw-p-4 sm:tw-p-6"
    >
      <ThemeButton
        class="tw-absolute tw-top-4 tw-right-4 sm:tw-top-6 sm:tw-right-6 tw-z-10"
      />
      <q-card-section class="tw-pt-0">
        <div class="tw-text-2xl tw-font-bold tw-text-center">Авторизация</div>
      </q-card-section>

      <q-form @submit.prevent="onSubmit" class="tw-space-y-4">
        <EmailInput
          autofocus
          :model-value="email"
          @update:modelValue="email = $event"
        />

        <PasswordInput
          :model-value="password"
          @update:modelValue="password = $event"
        />

        <div class="tw-mt-4">
          <q-btn
            :disabled="!isFormValid"
            dense
            label="Войти"
            color="red-14"
            type="submit"
            class="tw-w-full"
          />
        </div>
      </q-form>

      <q-card-actions align="center" class="tw-mt-2 sm:tw-mt-4">
        <q-btn flat label="Создать аккаунт" @click="goRegister" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import ThemeButton from 'src/components/ThemeButton/index.vue';
import EmailInput from 'src/components/Inputs/EmailInput/index.vue';
import PasswordInput from 'src/components/Inputs/PasswordInput/index.vue';
import { isValidEmail, isValidPassword } from 'src/utils/validations';
import { useAuthStore } from 'src/stores/auth-store';

// import { isValidEmail } from 'src/utils/validations';

const email = ref('');
const password = ref('');

const isFormValid = ref(false);

const router = useRouter();

const authStore = useAuthStore();

const onSubmit = async () => {
  console.log('Login with', email.value, password.value);

  await authStore.login(email.value, password.value);
};

watch(
  [email, password],
  ([emailValue, passwordValue]) => {
    isFormValid.value = Boolean(
      isValidEmail(emailValue) && isValidPassword(passwordValue),
    );
  },
  { immediate: true },
);

const goRegister = async () => {
  await router.replace('/register');
};
</script>
