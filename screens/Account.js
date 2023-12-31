import React, { useState, useEffect } from 'react';
import {
    Box,
    NativeBaseProvider,
    View,
    Avatar,
    Button,
    HStack,
    VStack,
    Text,
    Stack,
    Heading,
    Image,
    ScrollView
} from 'native-base';
import firebase from "../backend/Firebase";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

function Account({ props }) {
    const navigation = useNavigation();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [img, setImg] = useState();
    const [des, setDes] = useState();

    const getUser = async () => {
        const user = firebase.auth.currentUser;
        if (user) {
            const uid = user.uid;
            const docRef = doc(firebase.db, "users", uid);
            try {
                const unsub = onSnapshot(docRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data()
                        setName(data.name);
                        setEmail(data.email);
                        setPhone(data.phone);
                        setImg(data.img);
                        setDes(data.desc);
                    } else {
                        // Muestra un mensaje si el documento no existe
                        console.log("No such document!");
                    }
                });
            } catch (errors) {
                console.log('Error getting document:', errors);
            }
        }
    };

    const [recipes, setRecipes] = useState([]);
    const getData = async () => {
        const user = firebase.auth.currentUser;
        if (user) {
            const uid = user.uid;
            const q = query(collection(firebase.db, "recipes"), where("userid", "==", uid));
            try {
                const unsub = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            console.log('account recipe added', change.doc.data());
                            setRecipes(prevRecipes => [...prevRecipes, change.doc.data()]);
                        } if (change.type === 'modified') {
                            console.log('account recipe modified', change.doc.data(), change.oldIndex);
                            setRecipes(prevRecipes => prevRecipes.map((recipe, index) => index === change.oldIndex ? change.doc.data() : recipe));
                        } if (change.type === 'removed') {
                            console.log('account recipe removed', change.oldIndex);
                            setRecipes(prevRecipes => prevRecipes.filter((_, index) => index !== change.oldIndex));
                        }
                    });
                });
            } catch (errors) {
                console.log("No such document!", errors);
            };
        };
    };



    const handelSummit = () => {
        const user = firebase.auth.currentUser;
        if (user) {
            const uid = user.uid;
            navigation.navigate("Editar cuenta", uid);
        };
    }

    const navRecipe = (recipeId) => {
        navigation.navigate("Editar receta", { recipeId: recipeId });
    };

    useEffect(() => {
        getData();
        getUser();
    }, []);

    return (
        <View>
            <Box bg={"black"} rounded={"0px 10px 10px 0px"} pl={'40%'} pr={'40%'} pt={'20%'}>
                This is a Box with Linear Gradient
            </Box>
            <Box ml={"9%"} w={"84%"}>
                <HStack space={4}>
                    <VStack>
                        <Avatar bg="amber.500" source={{
                            uri: img
                        }} size="2xl" mt={"-35%"}>
                            <Avatar.Badge bg="green.500" />
                        </Avatar>
                        <Button size="sm" colorScheme={'indigo'} variant="outline" mt={4} onPress={handelSummit}>Editar perfil</Button>
                    </VStack>
                    <Text fontSize={"2xl"} fontStyle={'italic'} fontWeight={'bold'}>{name}</Text>
                </HStack>
                <VStack mt={5}>
                    <Text bold>Descripción</Text>
                    <Text>{des} </Text>
                    <Text bold>Contacto</Text>
                    <Text>{email} </Text>
                    <Text>{phone} </Text>
                </VStack>
                <VStack mt={5} space={4}>
                    <Text bold>Tus recetas</Text>
                    <HStack space={4} flexWrap={'wrap'}>
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <>
                                    <Box w="45%" rounded="lg" mb={3} borderColor="coolGray.200"
                                        backgroundColor={'coolGray.50'} borderWidth="1">
                                        <Pressable onPress={() => navRecipe(recipe.name)} >
                                            <Image source={{
                                                uri: recipe.img
                                            }} alt="image" style={{ width: '100%', height: 100 }} />
                                            <Stack p="4" space={3}>

                                                <Heading size="md" ml="-1">
                                                    {recipe.name}
                                                </Heading>
                                                <Text fontWeight="400">
                                                    {recipe.time} min
                                                </Text>
                                            </Stack>
                                        </Pressable>
                                    </Box>
                                </>
                            ))
                        ) : (
                            <>
                                <Text>Parece que aun no agregas una receta, te animamos a que agregues una receta...</Text>
                                <Text>Comparte tus mejores recetas con nosotros</Text>
                            </>
                        )}
                    </HStack>
                </VStack>
            </Box>
        </View >
    )
};

export default ({ props }) => {
    return (
        <View minW={"100%"} minH={"100%"}>
            <ScrollView>
                <Account />
            </ScrollView>
        </View>
    );
};
