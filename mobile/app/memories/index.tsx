import { useEffect, useState } from "react";

import { 
  View, 
  TouchableOpacity, 
  ScrollView,
  Text,
  Image,
} from "react-native";
import Icon from "@expo/vector-icons/Feather"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import { Link, useRouter } from "expo-router";
import dayjs from "dayjs";
import ptBr from 'dayjs/locale/pt-br'

import { api } from "../../src/lib/api";

import NLWLogo from '../../src/assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBr)

interface MemoryProps {
  coverUrl: string;
  excerpt: string;
  createdAt: string;
  id: string
}

export default function Memories() {  
  const [memories, setMemories] = useState<MemoryProps[]>([])

  const { bottom, top } = useSafeAreaInsets();

  const router = useRouter()

  async function SignOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  },[])

  return (
    <ScrollView 
      className="flex-1  mb-6" 
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="flex-row mt-4 px-8 items-center justify-between">
        <NLWLogo />

        <Link 
          href="/new" 
          asChild
        >
          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={SignOut}
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            >
              <Icon name="log-out" size={16} color="#000" />
            </TouchableOpacity>

            <Link href="/new" asChild>
              <TouchableOpacity 
                activeOpacity={0.7}
                className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
              >
                <Icon name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        </Link>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-sm text-gray-100">
                  {dayjs(memory.createdAt).format("D[ de ]MMMM[ , ]YYYY")}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image 
                  source={{ uri: memory.coverUrl }}
                  alt=""
                  className="aspect-video w-full rounded-lg"
                />

                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>

                <Link href={`/memories/${memory.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">Ler Mais</Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )
        })}

      </View>
    </ScrollView>
  )
}