export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // Минимум 8 символов, одна заглавная буква, одна цифра
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidUsername = (username: string): boolean => {
  // Минимум 3 символа, только буквы, цифры и подчеркивания
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};
