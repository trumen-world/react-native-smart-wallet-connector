/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  TextInput,
  Alert
} from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


const App = () => {
  const [address , setAddress] = useState<string>('');
  const [messageToSign, onChangeText] = React.useState('');

  const handleDeepLink = (event: { url: any; }) => {
    console.log("event", event);

    const url = event.url;
    console.log('url', url);

    const address = getQueryParams(url).address;

    if (address) {
      setAddress(address);
      console.log('address', address);
      // You can handle the address here (e.g., navigate to a specific screen)
      
    }
  };
  
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('Initial URL:', url);
      handleDeepLink({ url });
    }
  }).catch(err => console.error('An error occurred', err));


  Linking.addEventListener('url', handleDeepLink);

  const getQueryParams = (url: string): { [key: string]: string } => {
    const params: { [key: string]: string } = {};
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let match;
    while ((match = regex.exec(url))) {
      params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return params;
  };

  const handleCreateButtonPress = () => {
    // const url = 'http://localhost:3000/create';
    const url = 'http://localhost:3000';
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleSignButtonPress = () => {
    // const url = 'http://localhost:3000/sign/{messageToSign}';
    const url = 'http://localhost:3000';
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCreateButtonPress}>
        <Text style={styles.buttonText}>Create CB Smart Wallet</Text>
      </TouchableOpacity>
      <Text>Address: {address}</Text>
      <View style={{height: 10}} />

      {/* A text input for user to enter the message to sign */}
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        placeholder="Enter message to sign"
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignButtonPress}>
        <Text style={styles.buttonText}>Sign the message with CB Smart Wallet</Text>
      </TouchableOpacity>

      {/* Handle NFT Minting */}
      {/* <TouchableOpacity style={styles.button} onPress={handleSignButtonPress}>
        <Text style={styles.buttonText}>Sign the message with CB Smart Wallet</Text>
      </TouchableOpacity> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#ff0000',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  webView: {
    flex: 1,
  },
});

export default App;
