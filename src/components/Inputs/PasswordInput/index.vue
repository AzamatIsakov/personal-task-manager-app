<template>
  <q-input
    :model-value="modelValue"
    :label="placeholder ?? 'Введите пароль'"
    type="password"
    outlined
    :hint="hint"
    dense
    :autofocus="autofocus"
    :rules="[(val) => !!val || (placeholder ?? 'Введите пароль')]"
    @update:modelValue="updateModelValue($event?.toString() || '')"
  />
</template>

<script setup lang="ts">
import { clearSpace } from 'src/utils';
import {
  type PasswordInputEmits,
  type PasswordInputProps,
} from './index.types';

defineProps<PasswordInputProps>();

const emit = defineEmits<PasswordInputEmits>();

const updateModelValue = (value: string) => {
  const trimmedValue = clearSpace(value);
  emit('update:modelValue', trimmedValue);
};
</script>
