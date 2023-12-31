import * as React from "react";
import {
    Box,
    Text,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    HStack,
    Center,
    View,
    Image,
    Pressable,
    Icon
} from "native-base";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import firebase from "./../backend/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {
    const navigation = useNavigation();
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});
    let regex_email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let re = /^[A-Z][a-z0-9_-]{8,32}$/
    const digit = /[0-9]/
    const upperCase = /[A-Z]/
    const lowerCase = /[a-z]/
    const nonAlphanumeric = /[^0-9A-Za-z]/
    var user = '';
    const isStrongPassword = (password) =>
        [digit, upperCase, lowerCase, nonAlphanumeric].every((re) => re.test(password))
        && password.length >= 8
        && password.length <= 32

    const validate = async () => {
        if (regex_email.test(formData.email) == false) {
            setErrors({
                ...errors,
                email: "Correo invalido"
            });
            return false;
        } else if (formData.email == undefined) {
            setErrors({
                ...errors,
                email: "Ingrese un correo"
            });
            return false;
        }
        if (isStrongPassword(formData.password) == false) {
            setErrors({
                ...errors,
                password: "Contraseña invalida"
            });
            return false;
        } else if (formData.password == undefined) {
            setErrors({
                ...errors,
                password: "Ingrese una constraseña"
            });
            return false;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(firebase.auth, formData.email, formData.password);
            user = userCredential.user;
            console.log('Sesión iniciada', user);
            navigation.navigate('Nav', { uid: user.uid });
            return true;
        } catch (error) {
            console.log("Error:" + error);
            setErrors({
                ...errors,
                password: "Credenciales invalidas"
            });
            return false;
        }
    };

    const onSubmit = async () => {
        const isValid = await validate();
        if (isValid) {
            navigation.navigate('Nav', { user });
        } else {
            console.log("Validation Failed", errors, formData.email, formData.password);
        }
    };

    const signInGoogle = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
                navigation.navigate('Nav', { uid: user.uid });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    return (
        <Center minH={'100%'} minW={'100%'} justifyContent="center">
            <Image source={{
                uri: "https://i.postimg.cc/CK8Dwt3Y/sombrero.png"
            }} alt="Chef" size="2xl" mt={'15%'} style={{ width: '80%' }} resizeMode="center" />
            <Image source={{
                uri: "https://i.postimg.cc/MTgfg8Z1/Log-In.png"
            }} alt="Txt" size="lg" mt={-15} style={{ width: '80%' }} resizeMode="contain" />
            <Box pb={'5%'} p="8" minW="100%" mt={'auto'} bottom={0} bg={"white"} roundedTopLeft={25} roundedTopRight={25}>
                <Center w={"100%"}>
                    <VStack minW={"100%"} >
                        <FormControl isRequired isInvalid={'email' in errors}>
                            <FormControl.Label color={"white"}> <Text fontSize={"lg"}>Correo electronico</Text></FormControl.Label>
                            <Input variant="rounded"
                                onChangeText={value => setData({
                                    ...formData,
                                    email: value
                                })} bg={"white"} minW={"100%"} fontSize={"lg"}
                                InputLeftElement={<Icon as={<AntDesign name="user" size={24} color="black" />} ml="5"></Icon>} placeholder="example@email.com" />
                            {'email' in errors ?
                                <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : ""
                            }
                        </FormControl>
                        <FormControl isRequired isInvalid={'password' in errors}>
                            <FormControl.Label><Text fontSize={"lg"}>Constraseña</Text></FormControl.Label>
                            <Input variant="rounded" placeholder="********" type="password"
                                onChangeText={value => setData({
                                    ...formData,
                                    password: value
                                })} bg={"white"} minW={"100%"} fontSize={"lg"} />
                            {'password' in errors ?
                                <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage> : ""
                            }
                            <Link _text={{
                                fontSize: "sm",
                                fontWeight: "600",
                                color: "indigo.500"
                            }} href="#" alignSelf="flex-end">
                                Olvidaste la contraseña?
                            </Link>
                        </FormControl>
                        <Button title="Sign" onPress={onSubmit} size="lg" mt="4" colorScheme="indigo" borderRadius="full">
                            Iniciar sesión
                        </Button>
                        <VStack mt="4">
                            <HStack justifyContent="center">
                                <Text fontSize="md" color="warmGray.500" _dark={{
                                    color: "warmGray.500"
                                }}>
                                    o
                                </Text>
                            </HStack>
                            <HStack justifyContent="center" mt="4" space={4} maxH={"40px"}>
                                <Link variant={"link"} onPress={signInGoogle}><Icon as={<AntDesign name="google" />} size={30}></Icon></Link>
                            </HStack>
                            <HStack mt="6" justifyContent="center">
                                <Text fontSize="sm" color="warmGray.500" _dark={{
                                    color: "warmGray.500"
                                }}>
                                    Eres un usuario nuevo?{" "}
                                </Text>
                                <Pressable>
                                    <Link _text={{
                                        color: "indigo.500",
                                        fontWeight: "medium",
                                        fontSize: "md"
                                    }} onPress={() => navigation.navigate('Registro')}>Registrate</Link>
                                </Pressable>
                            </HStack>
                        </VStack>
                    </VStack>
                </Center>
            </Box>
        </Center >
    )
};


export default function ({ porps }) {
    return (
        <View minH={"100%"} minW={"100%"} bg={"#4b2ba0"} pt={"5%"} >
            <Login />
        </View>
    )
};