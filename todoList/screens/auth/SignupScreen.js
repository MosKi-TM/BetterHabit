import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { login, signup } from '../../components/authManager/apiService'; // Import login from apiService
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  // States to manage user inputs and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle the signup form submission
  const handleSignup = async () => {
    try {
      // Send the signup request to the backend
      const signupReponse = await signup(username, password);

      // If signup is successful, navigate to the next screen
      const data = await login(username, password);

      if (data) {  
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      }
    } catch (error) {
      // Handle errors (e.g., user already exists, invalid input)
      setErrorMessage(error.response ? error.response.data.message : 'Error during signup');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.appLogo}
        source={require('../../assets/logotest.png')}
      />

      {/* Username input */}
      <TextInput
        style={styles.login}
        placeholder={'Register'}
        value={username}
        onChangeText={setUsername} // Update the state when the user types
      />
      
      {/* Password input */}
      <TextInput
        secureTextEntry={true}
        style={styles.login}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword} // Update the state when the user types
      />

      {/* Error message display */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Signup button */}
      <TouchableOpacity style={styles.connectWrapper}  onPress={handleSignup}>
        <View >
          <Text style={styles.connectText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    alignItems: 'center', // Centers the children horizontally
    justifyContent: 'center', // Centers the children vertically
  },
  appLogo: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    marginHorizontal: 'auto',
    borderRadius: 12,
  },
  login: {
    width: '80%',
    backgroundColor: '#fff',
    marginHorizontal: 'auto',
    borderRadius: 25,
    textAlign: 'center',
    marginVertical: 10,
    padding: 10,
  },
  connectWrapper: {
    width: '80%',
    backgroundColor: '#ADD8E6',
    alignSelf: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 12,
  },
  connectText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
});
