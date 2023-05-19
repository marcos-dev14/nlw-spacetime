import { useEffect, useState } from "react";

import { ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { styled } from "nativewind"
import { SplashScreen, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';

import { 
  useFonts,
  Roboto_400Regular, 
  Roboto_700Bold 
} from '@expo-google-fonts/roboto';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyleStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticate, setIsUserAuthenticate] = useState<null | boolean>(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular, 
    Roboto_700Bold, 
    BaiJamjuree_700Bold
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then(token => {
      setIsUserAuthenticate(!!token) // Essa "!!" ela transforma a string em boolean
    })
  },[])

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ImageBackground 
      source={blurBg} 
      className="relative bg-gray-900 flex-1"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyleStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent'
          } 
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticate} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  )
}