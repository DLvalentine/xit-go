import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import RawEditor from './views/RawEditor';

export default function App() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer documentTitle={{
      formatter: (options, route) =>
        `${options?.title ?? route?.name} - Xit-Go`,
    }}>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        {/*<Tab.Screen name="Visual Editor" component={VisualEditor} options={{tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="eye" color={color} size={size} />}} />*/}
        <Tab.Screen name="Raw Editor" component={RawEditor} options={{tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="code-braces" color={color} size={size} />}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}