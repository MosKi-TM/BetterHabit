import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from '../../components/Task';
import { useState, useEffect  } from 'react';
import { FloatingAction } from "react-native-floating-action";
import DialogInput from 'react-native-dialog-input';
import { logout, createGroup, getGroups, joinGroupByCode } from '../../components/authManager/apiService'; // Import login from apiService
import AsyncStorage from '@react-native-async-storage/async-storage';

const actions = [
    {
        text: "Ajout depuis un lien",
        icon: '',
        name: "addFromLink",
        position: 1
      },
      {
        text: "Creer un clip",
        icon: '',
        name: "createClip",
        position: 2
      },
      {
        text: "Deconnexion",
        icon: '',
        name: "logout",
        position: 3
      }
    ];

export default function HomeScreen({ navigation }) {

  const [groupItems, setGroupItems] = useState([])
  const [showInput, setShowInput] = useState(false);
  const [showCreation, setShowCreation] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [newList, setNewList] = useState({title:'', logo:''})
  const [username, setUsername] = useState('');

  const [code, setCode] = useState('');

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };
  
    loadUsername();
    loadGroups(); // <--- Fetch groups after loading username
  }, []);
  

  const handleNavigationToGroup = (index) => {
    navigation.navigate('Task', groupItems[index]);
  }

  const accessGroup = (index) => {
    handleNavigationToGroup(index)
  }

  const handleAddGroup = async (code) => {
    setShowInput(false);
    try {
      await joinGroupByCode(code);
      await loadGroups(); // Refresh the list of groups
    } catch (error) {
      console.error("Failed to join group with code", error);
      // Optionally show a user-friendly message here
    }
  };

  const loadGroups = async () => {
    try {
      const groups = await getGroups();
      
      const formatted = groups.map(group => ({
        name: group.title + " : " +group.code,
        logo: '📌', // Use emoji or adapt based on backend data
        id: group._id,
        users: group.users
      }));
      
      setGroupItems(formatted);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    }
  };
  
  // Create a group using backend API
  const createNewList = async (clip) => {
    try {
      const group = await createGroup(clip.title);
      await loadGroups();
    } catch (err) {
      console.error("Group creation failed", err);
    }
  };

  const HandleAction = (name) => {
    switch(name){
        case 'addFromLink':
            setShowInput(true);
            break;
        
        case 'createClip':
            setShowCreation(true);
            break;
        
        case 'logout':
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          break;
    }
    
  }

  return (
    <View style={styles.container}>
       {/* Today Task */}
       <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>{username}'s Today Tasks</Text>
          <View style={styles.items}>
            {/* Tasks */}
            {
              groupItems.map(({name, logo}, index) => {
                  return <TouchableOpacity key={index} onPress={() => accessGroup(index)}>
                        <Task key={index} text={name} logo={logo}/>
                        </TouchableOpacity>
              })
            }
          </View>
       </View>

        <FloatingAction
            actions={actions}
            onPressItem={HandleAction}
        />

    <DialogInput isDialogVisible={showInput}
            title={"Ajout d'un clip"}
            hintInput ={"Code"}
            submitInput={handleAddGroup}
            closeDialog={ () => {setShowInput(false)}}>
    </DialogInput>

    <DialogInput isDialogVisible={showCreation}
            title={"Ajout d'un titre"}
            hintInput ={"titre"}
            submitInput={(content) => {
                setNewList({title: content, logo: newList.logo})
                setShowCreation(false)
                setShowEmoji(true)
            }}
            closeDialog={ () => {
                setShowCreation(false)
            }}>
    </DialogInput>

    <DialogInput isDialogVisible={showEmoji}
            title={"Ajout d'un emoji"}
            hintInput ={"logo"}
            submitInput={(content) => {
                console.log(content);
                createNewList({title: newList.title, logo: content});
                setShowEmoji(false)
            }}
            closeDialog={ () => {
                setShowEmoji(false)
            }}>
    </DialogInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED'
  },
  
  taskWrapper:{
    paddingTop: 80,
    paddingHorizontal: 20
  },
  items:{
    marginTop:30
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight: 'bold'
  },
  writeTaskWrapper:{
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input:{
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    backgroundColor: '#FFF'
  },
  addWrapper:{
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1
  },
  menu: {
    backgroundColor: '#f0f0f0',
    marginTop: 5,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#007AFF',
  },
  input: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  }
});
