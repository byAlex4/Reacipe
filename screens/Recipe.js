import React, { useState, useEffect } from 'react';
import {
    Center,
    Input,
    CheckIcon,
    View,
    VStack,
    HStack,
    Box,
    Text,
    Image,
    Select,
    FormControl,
    TextArea,
    Button
}
    from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";
import firebase from "../backend/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Exportar el componente CrearReceta
const Receta = () => {
    const route = useRoute();
    const [receta, setReceta] = useState([]);

    // Obtiene el firebaseId del parámetro de navegación
    const { recipeId } = route.params;

    const firebaseData = [];
    const getDatos = async () => {
        const q = query(collection(firebase.db, "recipes"), where("name", "==", recipeId));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                firebaseData.push(doc.data());
            });
            setReceta(firebaseData);
        } catch (errors) {
            console.log("No such document!", errors);
        }
    }
    useEffect(() => {
        getDatos();// Llama a la función getDatos
    }, []); // Pasa un
    return <Center w={"90%"} ml={"5%"}>
        <Box w={"95%"} bg={"white"} rounded={'xl'} p={"5%"}>
            {receta.map((recipe) => (
                <>
                    <Text fontSize={"2xl"} fontStyle={'italic'} fontWeight={'bold'}>{recipe.name}</Text>
                    <HStack w={"95%"} space={2}>
                        <Image source={{
                            uri: recipe.img
                        }} alt="Txt" size="lg" style={{ width: '120px', marginTop: '15px' }} resizeMode="contain"
                            onPress={() => pickImage} />
                        <VStack space={1} w={'60%'}>
                            <Text style={{ fontSize: '20px', color: 'rgb(115, 115, 115)' }}>Categoria:</Text>
                            <Text fontSize={'md'}>{recipe.category}</Text>
                            <Text style={{ fontSize: '20px', color: 'rgb(115, 115, 115)' }}>Tiempo:</Text>
                            <Text fontSize={'md'}>{recipe.time}</Text>
                        </VStack>
                    </HStack>
                    <Text style={{ fontSize: '20px', color: 'rgb(115, 115, 115)' }}>Descripcion:</Text>
                    <Text fontSize={'md'}>{recipe.description}</Text>
                    <Text style={{ fontSize: '20px', color: 'rgb(115, 115, 115)' }}>Ingredientes:</Text>
                    <Text fontSize={'md'}>{recipe.ingredient}</Text>
                    <Text style={{ fontSize: '20px', color: 'rgb(115, 115, 115)' }}>Pasos:</Text>
                    <Text fontSize={'md'}>{recipe.steps}</Text>
                </>
            ))}
        </Box>
    </Center>;
}

export default function () {
    return (
        <View minH={"100%"} minW={"100%"} pt={"5%"} bg={"gray.200"}>
            <Receta />
        </View>
    );
};
