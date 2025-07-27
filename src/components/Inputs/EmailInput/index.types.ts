export interface EmailInputProps {
  modelValue: string;
  autofocus?: boolean;
  placeholder?: string;
  hint?: string;
}

export interface EmailInputEmits {
  (event: 'update:modelValue', value: string): void;
}
