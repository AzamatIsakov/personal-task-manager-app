import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

export const useRouteTo = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const currentRoute = router.currentRoute.value;

  const routeTo = async (path: string) => {
    if (
      authStore.isAuthenticated &&
      currentRoute.path !== '/login' &&
      currentRoute.path !== '/register'
    ) {
      await router.push(path);
    } else {
      await router.replace('/login');
    }
  };

  return {
    routeTo,
  };
};
