import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios'; // If you installed Axios 
import { login } from '../../components/authManager/apiService'; // Import login from apiService
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Make the POST request to the backend
      const data = await login(username, password);

      if (data) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      }


    } catch (error) {
      setErrorMessage('Invalid credentials or server error');
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.appLogo}
        source={require('../../assets/logotest.png')}
      />

      <TextInput
        style={styles.login}
        placeholder={'Username'}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.login}
        secureTextEntry={true}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <TouchableOpacity style={styles.connectWrapper}  onPress={handleLogin}>
        <View>
          <Text style={styles.connectText}>Connect</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.connectWrapper}  onPress={() => {
        navigation.navigate('Signup')
      }}>
        <View>
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
    alignItems: 'center',
    justifyContent: 'center',
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
