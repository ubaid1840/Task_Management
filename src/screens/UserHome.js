import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet, } from "react-native";
import styles from "../Style";
import { useState, useEffect, useContext } from "react";
import { getAuth } from "firebase/auth";
import app from "../config/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getFirestore, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-root-toast';
import Constants from "expo-constants";
import { AuthContext } from "../store/context/AuthContext";


export default function UserHomeScreen(props) {

    // const extractKey = ({ number }) => number

    const db = getFirestore(app)

    const { state: authState, setAuth, clearAuth } = useContext(AuthContext)

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [loading, setloading] = useState(true)
    const [datalist, setdatalist] = useState([])
    const [remarksIndex, setRemarksIndex] = useState("")

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    useEffect(() => {

        if (authState.value.email == null) {

            Toast.show('Logout Successful!', {
                duration: Toast.durations.SHORT,
                shadow: true,
                animation: true,
            });
            props.navigation.navigate('Login')
        }
    }, [authState])

    useEffect(() => {
        fetchdata()
    }, [])

    const fetchdata = async () => {
        try {
            const taskRef = collection(db, 'task');
            const q = query(taskRef, orderBy("timestamp", 'desc'));
            const querySnapshot = await getDocs(q);
            const data = []
            querySnapshot.forEach((doc) => {
                if (doc.data().assignto.email == getAuth().currentUser.email) {
                    data.push(doc.data())
                    console.log(doc.data())
                }
            });
            setdatalist(data)
            setloading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const updateRemark = async (remarks) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'task'));
            querySnapshot.forEach((doc) => {
                console.log(doc.data().timestamp)
                if (doc.data().timestamp.isEqual(datalist[remarksIndex].timestamp)) {
                    updatedoc(doc.id, remarks)
                }

            });
        } catch (e) {
            console.log(e)
        }
    }

    const updatedoc = async (docid, remarks) => {
        const updatevalue = doc(db, "task", docid);

        await updateDoc(updatevalue, {
            remarks: remarks
        });
        fetchdata()
    }

    const logoutaccount = () => {
        clearAuth()
    }

    return (

        <>
            {
                getAuth().currentUser == undefined ? null :
                <SafeAreaView style={{ backgroundColor: '#000000E3' }}>
                    <StatusBar style='light' backgroundColor="black" />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Select remarks for your task</Text>
                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    updateRemark("Not started yet")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 150 }]}>
                                        <Text style={styles.gradientbuttontext}>Not started yet</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    updateRemark("Client not responding")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 150 }]}>
                                        <Text style={styles.gradientbuttontext}>Client not responding</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    updateRemark("Waiting client feedback")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 150 }]}>
                                        <Text style={styles.gradientbuttontext}>Waiting client feedback</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    updateRemark("Still Working")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 150 }]}>
                                        <Text style={styles.gradientbuttontext}>Still working</Text>
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
                                    <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible1(!modalVisible1);
                                        logoutaccount()
                                    }}>
                                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                            <Text style={styles.gradientbuttontext}>Yes</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible1(!modalVisible1)
                                    }}>
                                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                            <Text style={styles.gradientbuttontext}>No</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                    <View style={{ width: '100%', height: '100%', alignItems: 'center', paddingTop: Constants.statusBarHeight, }}>

                        <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'black', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15, height: 70 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{}} onPress={() => {
                                    setModalVisible1(!modalVisible1)
                                    return true;
                                }}>

                                    <Image style={{ height: 30, width: 30, }} source={require('../../assets/logout.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { fetchdata() }}>
                                    <Image style={{ width: 40, height: 40, }} source={require('../../assets/chitchatlogo.png')}></Image>
                                </TouchableOpacity>

                            </View>
                            <View>
                                <TouchableOpacity onPress={() => {
                                    props.navigation.navigate('Settings')
                                }}
                                    onLongPress={() => {

                                    }}>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ height: '90%', marginBottom: 10, marginTop: 10, width: '95%' }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={datalist}

                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity style={{ width: '100%', alignItems: 'center' }} onLongPress={() => {
                                            setRemarksIndex(index)
                                            setModalVisible(!modalVisible);
                                        }}>
                                            <View style={{ backgroundColor: '#262829', justifyContent: 'center', padding: 15, marginTop: 5, borderRadius: 15, width: '95%', borderColor: '#FFFFFF2C', borderWidth: 1, }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>{item.task.toLocaleUpperCase()}</Text>
                                                </View>
                                                <Text style={{ fontSize: 15, color: item.status == "completed" ? 'green' : 'red', }}>Status: {item.status}</Text>
                                                <Text style={{ fontSize: 15, color: 'white', }}>Remarks: {item.remarks}</Text>
                                                <Text style={{ fontSize: 12, color: 'white', }}>Assign data: {item.localtime}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    )
                                }}

                            />
                        </View>
                        {loading ? CustomActivityIndicator() : null}

                    </View>

                </SafeAreaView>
            }
        </>
    )
}

const styless = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        marginTop: 20,
        flex: 1,
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
        flexDirection: 'column',
        borderRadius: 30
    },
});
