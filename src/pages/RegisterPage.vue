<template>
  <div class="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
    <q-card
      class="tw-relative tw-w-full tw-max-w-[300px] sm:tw-max-w-md tw-p-4 sm:tw-p-6"
    >
      <ThemeButton
        class="tw-absolute tw-top-4 tw-right-4 sm:tw-top-6 sm:tw-right-6 tw-z-10"
      />
      <q-card-section class="tw-pt-0">
        <div class="tw-text-2xl tw-font-bold tw-text-center">Регистрация</div>
      </q-card-section>

      <q-form @submit.prevent="onSubmit" class="tw-space-y-4">
        <EmailInput
          autofocus
          :model-value="email"
          @update:modelValue="email = $event"
        />

        <PasswordInput
          :model-value="password"
          hint="Минимум 8 символов, одна заглавная буква, одна цифра"
          @update:modelValue="password = $event"
        />

        <q-separator />

        <PasswordInput
          :model-value="submitPassword"
          placeholder="Подтвердите пароль"
          hint="Пароли должны совпадать"
          @update:modelValue="submitPassword = $event"
        />

        <div class="tw-mt-4">
          <q-btn
            :disabled="!isFormValid"
            dense
            label="Зарегистрироваться"
            color="red-14"
            type="submit"
            class="tw-w-full"
          />
        </div>
      </q-form>

      <q-card-actions align="center" class="tw-mt-2 sm:tw-mt-4">
        <q-btn flat label="Войти" @click="goLogin" />
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

const router = useRouter();

const email = ref('');
const password = ref('');
const submitPassword = ref('');

const isFormValid = ref(false);

const authStore = useAuthStore();

watch(
  [email, password, submitPassword],
  ([emailValue, passwordValue, submitPasswordValue]) => {
    isFormValid.value = Boolean(
      isValidEmail(emailValue) &&
        isValidPassword(passwordValue) &&
        isValidPassword(submitPasswordValue) &&
        passwordValue === submitPasswordValue,
    );
  },
  { immediate: true },
);

const onSubmit = async () => {
  console.log('Login with', email.value, password.value);

  await authStore.register(email.value, password.value);
};

const goLogin = async () => {
  await router.replace('/login');
};
</script>
