import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from "styled-components";

import { Routes } from './routes/'; 

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './global/styles/theme';

import { AuthProvider, useAuth } from './hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const { userStorageLoading } = useAuth()

  if(!fontsLoaded || userStorageLoading){
    return <AppLoading/>
  }

  return (
    <ThemeProvider theme={theme}>
        <StatusBar style="light" />

        <AuthProvider>
          <Routes/>
        </AuthProvider>
    </ThemeProvider>
  );
}