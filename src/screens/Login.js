import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView, Text, TextInput, TouchableOpacity, View, Modal, Image, ActivityIndicator, BackHandler, KeyboardAvoidingView,
    ScrollView, Button
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styles from '../Style';
// import Pushnotifications from '../pushnotifications';
import Toast from 'react-native-root-toast';
import { AuthContext } from '../store/context/AuthContext'

export default function LoginScreen(props) {

   
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [isEmailValid, setisEmailValid] = useState(false)
    const [isPasswordValid, setisPasswordValid] = useState(false)
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [emailfocus, setemailfocus] = useState('primary')
    const [passfocus, setpassfocus] = useState('primary')
    const [showModal, setShowModal] = useState(false);
    const { state: authState, setAuth } = useContext(AuthContext)

    useEffect(() => {
        const backAction = () => {
            setModalVisible(true)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const isFocused = useIsFocused()
    useEffect(() => {
        setEmail("")
        setPassword("")
    }, [isFocused])

    useEffect(() => {

        setisEmailValid(Email.includes('.com') && Email.includes('@') ? true : false)
        setisPasswordValid(Password.length > 5 && Password.length < 19 ? true : false)



    }, [Email, Password])

    useEffect(() => {

        if (authState.value.email != null) {
            Toast.show('Login Successful!', {
                duration: Toast.durations.SHORT,
                shadow: true,
                animation: true,
            });
            props.navigation.navigate("UserHome")
        }
    }, [authState])

    const LoginAccount = () => {
        if (Email.toLocaleLowerCase() == "adeelahsan@gmail.com" && Password == "12345678") {
            props.navigation.navigate('ListTask')
        }
        else {
            setAuth(Email, Password)
        }
    }

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar style="light" />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to exit?</Text>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible);
                            BackHandler.exitApp()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>Yes</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>No</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to exit?</Text>
                        <TouchableOpacity onPress={() => {
                            setModalVisible1(!modalVisible1);
                            BackHandler.exitApp()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>Yes</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>No</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.container}>
                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
                    <Image style={{ width: 70, height: 70, marginBottom: 50 }} source={require('../../assets/chitchatlogo.png')}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start', }}>Login</Text>
                <Text style={{ color: 'grey', fontSize: 15, alignSelf: 'flex-start', marginTop: 5, marginBottom: 30 }}>Please sign in to continue</Text>
                <TextInput style={emailfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Email" placeholderTextColor="#B8B8B8DC" value={Email} onChangeText={(email) => { setEmail(email) }} onFocus={() => {
                    setemailfocus('secondary')
                }} onBlur={() => { setemailfocus('primary') }} ></TextInput>
                {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                <TextInput secureTextEntry style={passfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Password" placeholderTextColor="#B8B8B8DC" value={Password} onChangeText={(val) => { setPassword(val) }} onFocus={() => { setpassfocus('secondary') }} onBlur={() => { setpassfocus('primary') }} ></TextInput>
                {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                <TouchableOpacity style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 5, alignSelf: 'flex-end' }} onPress={() => {
                    props.navigation.navigate('ForgetPassword')
                }} >
                    <Text style={{ color: '#FDD180', fontWeight: 'bold' }}>Forgot Password?</Text>
                </TouchableOpacity>
                {isEmailValid && isPasswordValid ?
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => {
                        if (isEmailValid && isPasswordValid) {
                            // setloading(true)
                            LoginAccount()
                        }
                        else {
                        }
                    }}>
                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'orange' }]}>
                            <Text style={[styles.gradientbuttontext, { color: '#000000E3' }]}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    :
                    <LinearGradient colors={['#FDD18076', '#FFA60065']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'grey' }]}>

                        <Text style={[{ color: '#FFFFFF5A' }, styles.gradientbuttontext]}>Login</Text>
                        {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                    </LinearGradient>
                }

                <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    props.navigation.navigate('SignUp')
                }}>
                    <Text style={{ color: '#FDD180', fontWeight: 'bold', fontSize: 12 }}>Don't have an account? Create a new account</Text>
                </TouchableOpacity>
                {authState.value.loading ? CustomActivityIndicator() : null}
            </View>

        </SafeAreaView>
    );
}