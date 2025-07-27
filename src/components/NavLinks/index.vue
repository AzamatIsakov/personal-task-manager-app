<template>
  <nav
    class="tw-flex tw-flex-col tw-justify-center tw-gap-2 tw-px-2 tw-mt-4 tw-gap-2"
  >
    <q-btn
      v-for="link in navigationLinks"
      :key="link.to"
      align="left"
      flat
      dense
      :icon="link.icon"
      :aria-label="link.label"
      :disable="currentRoute.path === link.to"
      @click="routeTo(link.to)"
    >
      <span class="tw-ml-2">{{ link.label }}</span>
    </q-btn>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { navigationLinks } from './index.data';
import { useRouteTo } from 'src/composbles/useRouteTo';
import { computed } from 'vue';

const router = useRouter();

const { routeTo } = useRouteTo();

const currentRoute = computed(() => router.currentRoute.value);
</script>
