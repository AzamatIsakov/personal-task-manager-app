export interface PasswordInputProps {
  modelValue: string;
  autofocus?: boolean;
  placeholder?: string;
  hint?: string;
}

export interface PasswordInputEmits {
  (event: 'update:modelValue', value: string): void;
}
