<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="Go Home"
        no-caps
        @click="routeTo('/')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteTo } from 'src/composbles/useRouteTo';

const { routeTo } = useRouteTo();
</script>
