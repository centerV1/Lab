import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import CategoriesScreen from './Categories.js';
import HomeScreen from './Home.js';
import MyListScreen from './MyList.js';

const Tab = createBottomTabNavigator();

export default function AssetExample() {
  return (
    <View style={styles.container}>
      <MyTabs />
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Cart':
              iconName = 'list';
              break;
            case 'Profile':
              iconName = 'list';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#070420',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CategoriesScreen} />
      <Tab.Screen name="Profile" component={MyListScreen} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070420',
    flex: 1,
  },
});
