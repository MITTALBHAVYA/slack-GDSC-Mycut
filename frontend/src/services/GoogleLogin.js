export const loginWithGoogle = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    window.open(`${VITE_API_URL}/api/v1/auth/google/callback`, "_self");
  }