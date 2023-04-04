import { View, Text, SafeAreaView, BackHandler, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet, } from "react-native";
import styles from "../Style";
import { useState, useEffect } from "react";
import app from "../config/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getFirestore, doc, serverTimestamp, addDoc, deleteDoc, orderBy, query, updateDoc } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-root-toast';
import Constants from "expo-constants";

export default function ListTaskScreen(props) {

    // const extractKey = ({ number }) => number

    const db = getFirestore(app)

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [modalVisible5, setModalVisible5] = useState(false);

    const [loading, setloading] = useState(true)
    const [taskList, setTaskList] = useState([])
    const [datalist, setdatalist] = useState([])
    const [task, setTask] = useState("")
    const [assignTo, setAssignTo] = useState("")
    const [taskIndex, setTaskIndex] = useState("")


    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    useEffect(() => {
        const backAction = () => {
            setModalVisible4(!modalVisible4)
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchdata("all")
        fetchprofiles()
    }, [])


    const fetchprofiles = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Profiles"));
            const data = []
            querySnapshot.forEach((doc) => {
                data.push(doc.data())
            });
            setdatalist(data)
            setloading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchdata = async (status) => {
        try {
            const taskRef = collection(db, 'task');
            const q = query(taskRef, orderBy("timestamp", 'desc'));
            const querySnapshot = await getDocs(q);
            const data = []
            querySnapshot.forEach((doc) => {
                if (status == 'all') {
                    data.push(doc.data())
                }
                else if (status == 'completed') {
                    if (doc.data().status == 'completed') {
                        data.push(doc.data())
                    }
                }
                else if (status == 'pending') {
                    if (doc.data().status == 'pending') {
                        data.push(doc.data())
                    }
                }
            });
            setTaskList(data)
            setloading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const savetask = async () => {
        // setloading(true)
        try {
            await addDoc(collection(db, "task"),
                {
                    //key: countref.current,
                    task: task,
                    assignto: assignTo,
                    localtime: new Date().toLocaleString([], { hour12: true }),
                    timestamp: serverTimestamp(),
                    status: "pending"

                });
            setTask("")
            setAssignTo("")
            setloading(false)
            alert("Task Saved")

        }
        catch (e) {
            alert(e)
        }
    }

    const deletemsg = async (docid) => {
        try {
            await deleteDoc(doc(db, 'task', docid));
            setloading(false)
            Toast.show('Task Deleted!', {
                duration: Toast.durations.SHORT,
                shadow: true,
                animation: true,
            });
            fetchdata("all")

        } catch (e) {
            alert(e)
        }
    }

    const findvalue = async (index) => {

        try {
            const querySnapshot = await getDocs(collection(db, 'task'));
            querySnapshot.forEach((doc) => {
                if (doc.data().timestamp.isEqual(taskList[index].timestamp)) {
                    deletemsg(doc.id)
                }

            });
        } catch (e) {
            console.log(e)
        }

        //   alert('message deleted')
    }

    const findvalue1 = async (status) => {

        try {
            const querySnapshot = await getDocs(collection(db, 'task'));
            querySnapshot.forEach((doc) => {
                if (doc.data().timestamp.isEqual(taskList[taskIndex].timestamp)) {
                    updatedocstatus(doc.id, status)
                }

            });
        } catch (e) {
            console.log(e)
        }

        //   alert('message deleted')
    }

    const updatedocstatus = async (docid, status) => {

        const updatevalue = doc(db, "task", docid);

        await updateDoc(updatevalue, {
            status: status
        });
        fetchdata("all")
    }

    return (

        <>
            {
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
                                <Text style={styles.modalText}>Select one option to filter task list</Text>
                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    fetchdata("all")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>All</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    fetchdata("completed")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Completed</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    fetchdata("pending")
                                    setModalVisible(!modalVisible);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Pending</Text>
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
                                <Text style={styles.modalText}>Add Task</Text>
                                <TextInput style={{ height: 100, width: 250, borderWidth: 2, borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderColor: '#D3D3D3', paddingLeft: 10, alignSelf: 'center', shadowColor: "#000", shadowOpacity: 0, shadowRadius: 0, elevation: 0, backgroundColor: 'white' }} placeholder="Enter Your Task" placeholderTextColor="#B8B8B8DC" value={task} onChangeText={(val) => { setTask(val) }} multiline={true}
                                    underlineColorAndroid='transparent' ></TextInput>

                                <TouchableOpacity style={{ backgroundColor: 'white', height: 40, width: 200, borderWidth: 1, alignSelf: 'center', borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10 }}
                                    onPress={() => { setModalVisible2(!modalVisible2) }}>
                                    <View>
                                        {assignTo == ""
                                            ?
                                            <Text>Select User</Text>
                                            :
                                            <Text>{assignTo.email}</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible1(!modalVisible1)
                                    setloading(true)
                                    savetask()
                                    fetchdata("all")
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Save</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setTask("")
                                    setAssignTo("")
                                    setModalVisible1(!modalVisible1);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                        }}>

                        <View style={{ width: '100%', height: '90%', alignSelf: 'center', }}>

                            <View style={styless.modalView}>

                                <Text style={styless.modalText}>Select User to assign task</Text>

                                <TouchableOpacity onPress={() => {
                                    setModalVisible2(!modalVisible2)

                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 10, alignSelf: 'center', marginTop: 10 }}>
                                        <Text style={styles.gradientbuttontext}>Close</Text>
                                        {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                    </LinearGradient>
                                </TouchableOpacity>
                                <View style={{ height: '90%', marginTop: 10, marginBottom: 10, paddingBottom: 10 }}>
                                    <FlatList
                                        data={datalist}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
                                                    setAssignTo(datalist[index])
                                                    setModalVisible2(!modalVisible2)
                                                }}>
                                                    <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: 400 }}>{item.email}</Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    //   keyExtractor={extractKey}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible3}
                        onRequestClose={() => {
                            setModalVisible3(!modalVisible3);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Delete Task</Text>
                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    setModalVisible3(!modalVisible3);
                                    findvalue(taskIndex)
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Yes</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setModalVisible3(!modalVisible3);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>No</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible4}
                        onRequestClose={() => {
                            setModalVisible4(!modalVisible4);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Are you sure you want to Logout?</Text>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible4(!modalVisible4)
                                    props.navigation.navigate("Login")
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Yes</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setModalVisible4(!modalVisible4);
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>No</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible5}
                        onRequestClose={() => {
                            setModalVisible5(!modalVisible5);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Change Status</Text>
                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    setModalVisible5(!modalVisible5);
                                    findvalue1("completed")
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Completed</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setloading(true)
                                    setModalVisible5(!modalVisible5);
                                    findvalue1("pending")
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Pending</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setModalVisible5(!modalVisible5);
                                 
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                        <Text style={styles.gradientbuttontext}>Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>

                    <View style={{ width: '100%', height: '100%', alignItems: 'center', paddingTop: Constants.statusBarHeight, }}>

                        <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'black', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15, height: 70 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{}} onPress={() => {
                                    setModalVisible4(!modalVisible4);
                                }}>

                                    <Image style={{ height: 30, width: 30, }} source={require('../../assets/logout.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { fetchdata('all') }}>
                                    <Image style={{ width: 40, height: 40, }} source={require('../../assets/chitchatlogo.png')}></Image>
                                </TouchableOpacity>

                            </View>
                            <View style={{}}>
                                <TouchableOpacity style={{}} onPress={() => {
                                    setModalVisible(!modalVisible)
                                }}>
                                    <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={require('../../assets/filtericon.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ height: '90%', marginBottom: 10, marginTop: 10, width: '95%' }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={taskList}

                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity style={{ width: '100%', alignItems: 'center' }} onPress={() => {
                                            setTaskIndex(index)
                                            setModalVisible5(!modalVisible5)
                                        }} onLongPress={() => {
                                            setTaskIndex(index)
                                            setModalVisible3(!modalVisible3)
                                        }}>
                                            <View style={{ backgroundColor: '#262829', justifyContent: 'center', padding: 15, marginTop: 5, borderRadius: 15, width: '95%', borderColor: '#FFFFFF2C', borderWidth: 1, }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>{item.task.toLocaleUpperCase()}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                                    <Text style={{ fontSize: 15, color: 'white', }}>Assigned to: </Text>
                                                    <Text style={{ fontSize: 15, color: 'white', }}>{item.assignto.firstname} {item.assignto.lastname}</Text>
                                                </View>

                                                <Text style={{ fontSize: 16, color: item.status == "completed" ? 'green' : 'red', }}>Status: {item.status}</Text>
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

                    <TouchableOpacity style={{}} onPress={() => {
                        setModalVisible1(!modalVisible1)
                    }}>
                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', right: 30, bottom: 30, height: 60, width: 60, borderRadius: 30, backgroundColor: '#FDD180', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ height: 50, width: 50, }} source={require('../../assets/addicon.png')}></Image>
                        </LinearGradient>
                    </TouchableOpacity>

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
