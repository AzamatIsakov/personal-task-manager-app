<script setup lang="ts">
import { Dark } from 'quasar';
import { toggleTheme } from 'src/utils';
</script>

<template>
  <q-btn
    flat
    dense
    :icon="Dark.isActive ? 'light_mode' : 'dark_mode'"
    aria-label="Toggle Dark Mode"
    @click="toggleTheme()"
  />
</template>
