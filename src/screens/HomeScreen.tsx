import {
  Image,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {theme} from '../theme';
import {useCallback, useState} from 'react';
import {debounce} from 'lodash';
import {fetchLocation, fetchWeatherForecast} from '../../api/weather';
import {WeatherData} from '../interfaces';
import {WeatherImages} from '../../constants';

const borderClass = (index: number, arr: number[]) => {
  return index + 1 !== arr.length ? 'border-b-2 border-b-gray-400' : '';
};

interface Location {
  name: string;
  country: string;
}

export const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);

  const initialWeather: WeatherData = {
    location: {
      name: '',
      region: '',
      country: '',
      lat: 0,
      lon: 0,
      tz_id: '',
      localtime_epoch: 0,
      localtime: '',
    },
    current: {
      last_updated_epoch: 0,
      last_updated: '',
      temp_c: 0,
      temp_f: 0,
      is_day: 0,
      condition: {
        text: '',
        icon: '',
        code: 0,
      },
      wind_mph: 0,
      wind_kph: 0,
      wind_degree: 0,
      wind_dir: '',
      pressure_mb: 0,
      pressure_in: 0,
      precip_mm: 0,
      precip_in: 0,
      humidity: 0,
      cloud: 0,
      feelslike_c: 0,
      feelslike_f: 0,
      windchill_c: 0,
      windchill_f: 0,
      heatindex_c: 0,
      heatindex_f: 0,
      dewpoint_c: 0,
      dewpoint_f: 0,
      vis_km: 0,
      vis_miles: 0,
      uv: 0,
      gust_mph: 0,
      gust_kph: 0,
    },
    forecast: {},
  };

  const [weather, setWeather] = useState<WeatherData>(initialWeather);

  const handleLocation = (loc: {name: string}) => {
    setLocations([]);
    fetchWeatherForecast({cityName: loc.name, days: 7}).then(data =>
      setWeather(data),
    );
  };

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchLocation({cityName: value}).then(data => setLocations(data));
      console.log(locations);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const {current, location} = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar />
      <Image
        blurRadius={70}
        source={require('../../assets/images/bg.png')}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1 mt-1">
        <View style={{height: '7%'}} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
            }}>
            {showSearch ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
                className="pl-6 h-10 flex-1 text-base text-white"
              />
            ) : null}
            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{backgroundColor: theme.bgWhite(0.3)}}
              className="rounded-full p-3 m-1">
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>

          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc: Location, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass(
                      index,
                      locations,
                    )}`}>
                    <MapPinIcon size="20" color="gray" />
                    <Text className="text-black text-md ml-2">
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name}
            <Text className="text-lg font-semibold text-gray-300">
              {', ' + location?.country}
            </Text>
          </Text>
          <View className="flex-row justify-center">
            <Image
              source={WeatherImages[current?.condition?.text] ?? 'other'}
              className="w-52 h-52"
            />
          </View>
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mx-4 mb-2">
          <View className="flex-row space-x-2 items-center">
            <Image
              source={
                WeatherImages[
                  Object.keys(WeatherImages).includes(current?.condition?.text)
                    ? current?.condition?.text
                    : 'other'
                ]
              }
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">
              {current?.wind_kph}km
            </Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Image
              source={require('../../assets/icons/drop.png')}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">
              {current?.humidity}%
            </Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Image
              source={require('../../assets/icons/sun.png')}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">6:05 PM</Text>
          </View>
        </View>
        <View className="mb-2 mt-4 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size="22" color="white" />
            <Text className="text-white text-base"> Daily forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}>
            {weather?.forecast?.forecastday?.map((item: any, index: number) => {
              return (
                <View
                  className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                  key={index}
                  style={{backgroundColor: theme.bgWhite(0.15)}}>
                  <Image
                    source={
                      WeatherImages[
                        Object.keys(WeatherImages).includes(
                          item?.day?.condition?.text,
                        )
                          ? item?.day?.condition?.text
                          : 'other'
                      ]
                    }
                    className="h-11 w-11"
                  />
                  <Text className="text-white">{item?.date}</Text>
                  <Text className="text-white text-xl font-semibold">
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};
