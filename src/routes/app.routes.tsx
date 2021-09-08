import React from "react";
import { MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "styled-components";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Register } from '../screens/Register';
import { Dashboard } from '../screens/Dashboard';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();
    
    return (
        <Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                headerShown: false,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    paddingVertical: 0,
                    height: 60
                }
            })}
        >
            <Screen 
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="format-list-bulleted" 
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
            <Screen 
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="attach-money" 
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Screen 
                name="Resume"
                component={Resume}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="pie-chart" 
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
        </Navigator>
    );
}