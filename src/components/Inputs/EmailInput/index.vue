<template>
  <q-input
    :model-value="modelValue"
    :label="placeholder ?? 'Введите email'"
    type="email"
    outlined
    :hint="hint"
    dense
    :autofocus="autofocus"
    :rules="[(val) => !!val || (placeholder ?? 'Введите email')]"
    @update:modelValue="updateModelValue($event?.toString() || '')"
  />
</template>

<script setup lang="ts">
import { clearSpace } from 'src/utils';
import { type EmailInputEmits, type EmailInputProps } from './index.types';

defineProps<EmailInputProps>();

const emit = defineEmits<EmailInputEmits>();

const updateModelValue = (value: string) => {
  const trimmedValue = clearSpace(value);
  emit('update:modelValue', trimmedValue);
};
</script>
