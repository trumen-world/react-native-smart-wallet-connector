/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
// import type {PropsWithChildren} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  TextInput,
} from 'react-native';

type AppState = {
  address: string;
  signature: {
    hex: string;
    valid: boolean;
  };
  message: string;
};

const App = () => {
  const [state, setState] = useState<AppState | null>(null);

  const handleDeepLink = useCallback(({url}: {url: string}) => {
    console.log('event', url);

    const {address, signature, valid} = getQueryParams(url);
    setState({
      address: address || '',
      signature: {
        hex: signature || '',
        valid: valid === 'true' ? true : false,
      },
      message: 'N/A',
    });
  }, []);

  useEffect(() => {
    const sub = Linking.addEventListener('url', handleDeepLink);

    return () => sub.remove();
  }, [handleDeepLink]);

  const getQueryParams = (url: string) => {
    const queryString = url.split('?')[1];
    const params: {[key: string]: string} = {};
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }
    return params;
  };

  Linking.getInitialURL()
    .then(url => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink({url});
      }
    })
    .catch(err => console.error('An error occurred', err));

  Linking.addEventListener('url', handleDeepLink);

  const handleCreateButtonPress = () => {
    const url = 'http://localhost:3000/connect';
    // const url = 'https://react-native-smart-wallet-web-app-pryority-pryoritys-projects.vercel.app';
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
    // const url = 'https://react-native-smart-wallet-web-app-pryority-pryoritys-projects.vercel.app/sign/{messageToSign}';
    const url = `http://localhost:3000/sign?message=${state?.message}&address=${state?.address}`;
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

  const handleSIWE = () => {
    // const url = 'https://react-native-smart-wallet-web-app-pryority-pryoritys-projects.vercel.app/sign/{messageToSign}';
    const url = 'http://localhost:3000/siwe';
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
      <Text>Address: {state?.address}</Text>
      <View style={{height: 10}} />

      {/* A text input for user to enter the message to sign */}
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        placeholder="Enter message to sign"
        onChangeText={text =>
          setState(p => {
            if (p === null) {
              return {
                address: state?.address || '',
                signature: {
                  hex: state?.signature.hex || '',
                  valid: state?.signature.valid || false,
                },
                message: state?.message || '',
              };
            } else {
              return {
                ...p,
                message: text,
              };
            }
          })
        }
      />
      <TouchableOpacity style={styles.button} onPress={handleSignButtonPress}>
        <Text style={styles.buttonText}>
          Sign the message with CB Smart Wallet
        </Text>
      </TouchableOpacity>
      <View style={{height: 10}} />
      <TouchableOpacity style={styles.button} onPress={handleSIWE}>
        <Text style={styles.buttonText}>Sign-in with Ethereum</Text>
      </TouchableOpacity>
      <Text style={styles.signature}>Signature: {state?.signature.hex}</Text>
      <Text style={styles.signature}>
        Valid: {state?.signature.valid ? 'TRUE' : 'FALSE'}
      </Text>

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
  signature: {
    maxHeight: 256,
    overflow: 'scroll',
  },
});

export default App;
