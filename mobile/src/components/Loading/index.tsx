import { View, ActivityIndicator } from 'react-native'

export function Loading() {
  return (
    <View className='bg-gray-900 flex-1 items-center justify-center'>
      <ActivityIndicator className='text-green-700' />
    </View>
  )
}