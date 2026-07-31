import { createContext, useContext } from 'react';
import { LightColors, DarkColors, ColorScheme } from './index';
import { useColorScheme } from 'react-native';

export function useColors(): ColorScheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : LightColors;
}
