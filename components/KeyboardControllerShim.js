// Minimal no-op shim for Expo Go environments where
// react-native-keyboard-controller native module is unavailable.
// Provides the subset of API that libraries like react-native-gifted-chat import.

import React from 'react';

export const KeyboardController = ({ children }) => children ?? null;
export const KeyboardProvider = ({ children }) => children ?? null;

export function useKeyboardHandler() {
  // No-op hook
  return undefined;
}

export function useReanimatedKeyboardAnimation() {
  // Return a stable object shape expected by callers
  return { height: { value: 0 }, progress: { value: 0 } };
}

export default {
  KeyboardController,
  KeyboardProvider,
  useKeyboardHandler,
  useReanimatedKeyboardAnimation,
};


