import React from "react";
import {
    Icon,
    View,
    ScrollView,
    Fab
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from "./Menu";
import Profile from "./Account";
import Favs from './Favs';

function HomeScreen() {
    return (
        <ScrollView >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Main />
            </View>
        </ScrollView>
    );
}

function ProfileScreen() {
    return (
        <ScrollView >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Profile uid={uid} />
            </View>
        </ScrollView>
    )
}
function FavScreen() {
    return (
        <ScrollView >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Favs />
            </View>
        </ScrollView>
    );
}

const ButtonA = ({ props }) => {
    const navigation = useNavigation();
    return <Fab renderInPortal={false}
        style={{
            backgroundColor: '#7356bf', width: '80',
            height: '80', position: 'absolute',
            bottom: '65px',
            right: '5px'
        }}
        shadow={2} size="2xl"
        icon={<Icon color="white" as={AntDesign}
            name="plus" size="2xl" />}
        onPress={() => navigation.navigate('Crear una receta', uid)} />
}

const Tab = createBottomTabNavigator();

export default function Footer(props) {
    const route = useRoute();
    const { uid } = route.params;
    return (
        <>
            <ButtonA uid={uid} />
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    "tabBarActiveTintColor": "lightgray",
                    "tabBarInactiveTintColor": "white",
                    "tabBarActiveBackgroundColor": "#7356bf",
                    "tabBarInactiveBackgroundColor": "#4b2ba0",
                    "tabBarStyle": [
                        {
                            "display": "flex"
                        },
                        null
                    ]
                }}
            >
                <Tab.Screen name="Account" component={ProfileScreen} initialParams={{ uid: uid }} options={{
                    headerShown: false,
                    tabBarIcon: () => (<Icon as={<AntDesign name="user" size={24} />} color={'white'}></Icon>)
                }} />
                <Tab.Screen name="Home" component={HomeScreen} initialParams={{ uid: uid }} options={{
                    headerShown: false,
                    tabBarIcon: () => (<Icon as={<AntDesign name="home" size={24} />} color={"white"}></Icon>)
                }} />
                <Tab.Screen name="Favorites" component={FavScreen} initialParams={{ uid: uid }} options={{
                    headerShown: false,
                    tabBarIcon: () => (<Icon as={<AntDesign name="heart" size={24} />} color={"white"} ></Icon>)
                }} />
            </Tab.Navigator>
        </>
    );
}