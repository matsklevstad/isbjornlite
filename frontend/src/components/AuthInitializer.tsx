"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';

export default function AuthInitializer() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check if we have an auth token in cookies
    const token = Cookies.get('auth-token');
    
    // Only run auth check if we have a token
    if (token) {
      checkAuth();
    }
  }, [checkAuth]);
  
  // This component doesn't render anything
  return null;
}