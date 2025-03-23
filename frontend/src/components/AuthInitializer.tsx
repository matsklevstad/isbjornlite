"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function AuthInitializer() {
  const { checkAuth, token } = useAuthStore();
  
  useEffect(() => {
    // Only run auth check if we have a token
    if (token) {
      checkAuth();
    }
  }, [token, checkAuth]);
  
  // This component doesn't render anything
  return null;
}