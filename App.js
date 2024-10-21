import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// SignInScreen Component
const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(number) && number.length === 10;
  };

  const formatPhoneNumber = (number) => {
    return number.replace(/\s?/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const handlePhoneNumberChange = (text) => {
    const cleanText = text.replace(/\D/g, '');
    setPhoneNumber(formatPhoneNumber(cleanText));
    if (validatePhoneNumber(cleanText)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Số điện thoại không hợp lệ.');
    }
  };

  const handleContinue = async () => {
    const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (validatePhoneNumber(cleanPhoneNumber)) {
      try {
        await AsyncStorage.setItem('phoneNumber', cleanPhoneNumber);
        Alert.alert('Thông báo', 'Đăng nhập thành công');
        navigation.navigate('Home');
      } catch (e) {
        console.error(e);
      }
    } else {
      Alert.alert('Lỗi', 'Số điện thoại không đúng định dạng. Vui lòng nhập lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.separator} />
      <Text style={styles.subtitle}>Nhập số điện thoại</Text>
      <Text style={styles.description}>
        Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại của bạn"
        placeholderTextColor="#a9a9a9"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        maxLength={13}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: phoneNumber.length === 0 || errorMessage !== '' ? '#ccc' : '#007bff' },
        ]}
        onPress={handleContinue}
        disabled={phoneNumber.length === 0 || errorMessage !== ''}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

// HomeScreen Component
const HomeScreen = ({ navigation }) => {
  const [storedPhoneNumber, setStoredPhoneNumber] = useState('');

  useEffect(() => {
    // Lấy số điện thoại từ AsyncStorage khi vào HomeScreen
    const getStoredPhoneNumber = async () => {
      try {
        const value = await AsyncStorage.getItem('phoneNumber');
        if (value !== null) {
          setStoredPhoneNumber(value);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getStoredPhoneNumber();
  }, []);

  // Nút để quay lại màn hình đăng nhập
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('phoneNumber'); // Xóa số điện thoại khỏi AsyncStorage
      navigation.navigate('SignIn'); // Điều hướng quay lại màn hình SignIn
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.title}>Chào mừng đến với HomeScreen</Text>
      <Text style={styles.message}>Số điện thoại đã đăng nhập: {storedPhoneNumber}</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Quay lại màn đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stack Navigator Setup
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'SignInScreen' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HomeScreen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: 'auto',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -15,
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

    
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: 'chocolate',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default App;
