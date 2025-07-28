<template>
  <div
    v-if="authStore.isLoading"
    class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
    :class="{
      'tw-bg-black/60': Dark.isActive,
      'tw-bg-white': !Dark.isActive,
    }"
  >
    <q-spinner size="50px" color="red-14" />
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { Dark } from 'quasar';
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from './stores/auth-store';

import { getTheme, setTheme } from './utils';

const theme = getTheme();

setTheme(theme);

const authStore = useAuthStore();

const router = useRouter();

const currentRoute = router.currentRoute.value;

onMounted(() => {
  authStore.listenForAuthChanges();
});

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (authStore.isLoading) return;

    if (!isAuthenticated) {
      if (currentRoute.path !== '/login' && currentRoute.path !== '/register') {
        await router.replace('/login');
      }

      await router.replace('/login');
    } else {
      await router.replace('/');
    }
  },
  { immediate: false },
);
</script>
