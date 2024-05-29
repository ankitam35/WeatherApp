import {Image, Text, View, StatusBar} from 'react-native';

export const HomeScreen = () => {
  return (
    <View className="flex-1 relative">
      <StatusBar />
      <Image
        blurRadius={70}
        source={require('../../assets/images/bg.png')}
        className="absolute h-full w-full"
      />
    </View>
  );
};
