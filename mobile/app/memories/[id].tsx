import { useEffect, useState } from "react";
import { 
  Text, 
  ScrollView, 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput,
  Switch,
  Alert
} from "react-native";
import { useSearchParams, Link, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from "dayjs";
import ptBr from 'dayjs/locale/pt-br'
import Icon from "@expo/vector-icons/Feather"

dayjs.locale(ptBr)

import { api } from "../../src/lib/api";

interface MemoryProps {
  coverUrl: string;
  content: string;
  createdAt: string;
  id: string
}

export default function Memory() {
  const [isMemory, setIsMemory] = useState({} as MemoryProps)
  const [isEdit, setIsEdit] = useState(false);

  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const { id } = useSearchParams();
  const route = useRouter()

  const { bottom, top } = useSafeAreaInsets();

  async function handleEditMemory() {
    try {
      const token = await SecureStore.getItemAsync('token');

      await api.put(`/memories/${id}`, {
        coverUrl: isMemory.coverUrl,
        content,
        isPublic,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      route.push('/memories')
    } catch (error) {
      Alert.alert("Memoria", "Não foi possível editar a memoria.")
      console.log(error);
    }
  }

  async function deleteMemory() {
    try {
      const token = await SecureStore.getItemAsync('token');

      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      route.push('/memories')
    } catch (error) {
      Alert.alert("Memoria", "Não foi possível deletar a memoria.")
      console.log(error);
    }
  }

  async function handleDeleteMemory() {
    Alert.alert("Memorias", "Você realmente quer deletar essa memoria?", [
      {
        text: "Não",
        style: "cancel"
      },
      {
        text: "Sim",
        onPress: deleteMemory,
      }
    ])
  }

  async function loadMemory() {
    try {
      const token = await SecureStore.getItemAsync('token');

      const response = await api.get(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setIsMemory(response.data)
    } catch (error) {
      Alert.alert("Memoria", "Não foi possível carregar a memoria.")
      console.log(error);
    }
  }

  useEffect(() => {
    loadMemory()
  },[])

  return (
    <ScrollView
      className="flex-1 mb-6"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <Link 
        href="/memories" 
        asChild
        className="ml-8 mt-4"
      >
        <TouchableOpacity 
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
        >
          <Icon name="arrow-left" size={16} color="#fff" />
        </TouchableOpacity>
      </Link>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center gap-2 mt-2">
          <View className="h-px w-5 bg-gray-50" />
          <Text className="font-body text-sm text-gray-100">
            {dayjs(isMemory.createdAt).format("D[ de ]MMMM[ , ]YYYY")}
          </Text>
        </View>

        <View className="flex-row gap-2 mr-5">
          <TouchableOpacity 
            onPress={() => setIsEdit(!isEdit)}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
          >
            <Icon name="edit" size={16} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDeleteMemory}
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="trash" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex gap-4 px-8 mt-2">
        <Image 
          source={{ uri: isMemory.coverUrl }}
          alt=""
          className="aspect-video w-full rounded-lg"
        />

        {!isEdit ? (
          <Text className="font-body text-base leading-relaxed text-gray-100">
            {isMemory.content}
          </Text>
        ) : (
          <View>
            <TextInput 
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              className="p-0 font-body text-lg text-gray-50"
              placeholderTextColor="#56565a"
              placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
            />

            <View className="flex-row items-center gap-4">
              <Switch 
                value={isPublic} 
                onValueChange={setIsPublic}
                trackColor={{ false: '#767577', true: '#372560' }}
                thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
              />
              <Text className="font-body text-base text-gray-200">
                Tornar memória pública
              </Text>
            </View>

            <TouchableOpacity 
              activeOpacity={0.7} 
              className="rounded-full self-end items-center bg-green-500 px-5 py-2"
            >
              <Text 
                onPress={handleEditMemory}
                className="font-alt text-sm uppercase text-black"
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}