import { Slot } from 'expo-router';
import React from 'react';
import { LanguageProvider } from '../hooks/i18n';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Slot />
    </LanguageProvider>
  );
}
