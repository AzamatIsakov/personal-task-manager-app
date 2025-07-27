<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-red-14 shadow-none">
        <q-btn
          flat
          dense
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          aria-label="First Page"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Personal Task Manager App</q-toolbar-title>

        <ThemeButton />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="q-pa-sm">
      <q-btn
        @click="authStore.logout()"
        flat
        dense
        icon="logout"
        aria-label="Logout"
      />
      <NavLinks />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import NavLinks from 'src/components/NavLinks/index.vue';
import ThemeButton from 'src/components/ThemeButton/index.vue';

import { useAuthStore } from 'src/stores/auth-store';

const leftDrawerOpen = ref(false);

const authStore = useAuthStore();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
