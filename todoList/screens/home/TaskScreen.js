import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from '../../components/Task';
import { useState, useEffect  } from 'react';
import { addTaskToGroup, getGroupById } from '../../components/authManager/apiService'; // Import login from apiService

export default function TaskScreen({ navigation, route }) {

  const [task, setTask] = useState([]);
  const [taskItems, setTaskItems] = useState([])

  const {logo, name, id: groupId} = route.params;

  // Fetch group tasks when the component is mounted
  useEffect(() => {
    const fetchGroupTasks = async () => {
      try {
        const group = await getGroupById(groupId); // Fetch group data
        setTaskItems(group); // Assuming tasks are an array of task titles
      } catch (error) {
        console.error('Failed to fetch group tasks', error);
      }
    };

    fetchGroupTasks();
  }, [groupId]); // Rerun when groupId changes

  const handleAddTask = () => {
    Keyboard.dismiss();
    // Now, create the task in the backend and add it to the group
    createTaskAndUpdateGroup(task);
    setTask('');
  };

  const createTaskAndUpdateGroup = async (taskTitle) => {
    try {
      const newTask = await addTaskToGroup(groupId, taskTitle); // addTaskToGroup sends POST request to create task
      setTaskItems(prevItems => [...prevItems, {title: newTask}]); // Update task list with the new task
    } catch (error) {
      console.error('Error adding task to group:', error);
    }
  };


  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    //itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }

  return (
    <View style={styles.container}>
       {/* Today Task */}
       <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>{logo} Groupe : {name}</Text>
          <View style={styles.items}>
            {/* Tasks */}
            {
              taskItems.map((item, index) => {
                  return <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                        <Task key={index} text={item.title}/>
                        </TouchableOpacity>
              })
            }
          </View>
       </View>

       {/*Write a Task*/}
       
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? 'padding':'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)}/>

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>

      </KeyboardAvoidingView>

       
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
  addText:{}
});
