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
  ScrollView,
} from 'react-native';

type AppState = {
  address?: string;
  siweSignature?: {
    hex: string | null;
    valid: boolean | null;
  };
  typedDataSignature?: {
    hex: string | null;
    valid: boolean | null;
  };
  message: string;
};

const App = () => {
  const [state, setState] = useState<AppState>({
    address: undefined,
    siweSignature: undefined,
    typedDataSignature: undefined,
    message: '',
  });

  const handleDeepLink = useCallback(({url}: {url: string}) => {
    console.log('event', url);

    const {
      address,
      siweSignature,
      typedDataSignature,
      siweValid,
      typedDataValid,
    } = getQueryParams(url);
    setState((p: AppState) => ({
      ...p,
      address,
      siweSignature: {
        hex: siweSignature ? siweSignature : p.siweSignature?.hex || '',
        valid: siweValid
          ? siweValid === 'true'
            ? true
            : false
          : p.siweSignature?.valid === true
          ? true
          : false,
      },
      typedDataSignature: {
        hex: typedDataSignature
          ? typedDataSignature
          : p.typedDataSignature?.hex || '',
        valid: typedDataValid
          ? typedDataValid === 'true'
            ? true
            : false
          : p.typedDataSignature?.valid === true
          ? true
          : false,
      },
    }));
  }, []);

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

  const handleCreateButtonPress = () => {
    const url = 'http://localhost:3000/connect';
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
    const url = `http://localhost:3000/sign?message=${state?.message}`;
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

  useEffect(() => {
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, [handleDeepLink]);

  useEffect(() => {
    console.log('State:', {state});
  }, [state]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateButtonPress}>
          <Text style={styles.buttonText}>Create Smart Wallet</Text>
        </TouchableOpacity>
        <Text style={styles.addressLabel}>
          Address: {state?.address?.slice(0, 6)}...
          {state?.address?.slice(
            state?.address?.length - 4,
            state?.address?.length,
          )}
        </Text>
        <View style={styles.separatorL} />

        {/* A text input for user to enter the message to sign */}

        <TouchableOpacity style={styles.button} onPress={handleSIWE}>
          <Text style={styles.buttonText}>Sign-in with Ethereum</Text>
        </TouchableOpacity>
        <View style={styles.separatorL} />
        <TextInput
          style={styles.input}
          placeholder="Enter message to sign"
          onChangeText={text =>
            setState((p: AppState | null) => ({
              ...p,
              message: text,
            }))
          }
        />
        <View style={styles.separator} />
        <TouchableOpacity style={styles.button} onPress={handleSignButtonPress}>
          <Text style={styles.buttonText}>Sign Message</Text>
        </TouchableOpacity>
        <View style={styles.separatorL} />
        {/* <TouchableOpacity style={styles.button} onPress={handlePermit}>
        <Text style={styles.buttonText}>Sign Permission</Text>
      </TouchableOpacity> */}
        <View style={styles.separator} />
        <Text style={styles.label}>
          SIWE Signature:{' '}
          {state?.siweSignature
            ? state?.siweSignature?.valid
              ? 'VALID'
              : 'INVALID'
            : 'NONE'}
        </Text>
        <Text style={styles.signature}>{state?.siweSignature?.hex}</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>
          Typed Data Signature Valid:{' '}
          {state?.typedDataSignature
            ? state?.typedDataSignature?.valid
              ? 'VALID'
              : 'INVALID'
            : 'NONE'}
        </Text>
        <Text style={styles.signature}>{state?.typedDataSignature?.hex}</Text>

        {/* Handle NFT Minting */}
        {/* <TouchableOpacity style={styles.button} onPress={handleSignButtonPress}>
        <Text style={styles.buttonText}>Sign the message with CB Smart Wallet</Text>
      </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 64,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  addressLabel: {
    width: '100%',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  signButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  signatureContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signature: {
    fontSize: 14,
    marginBottom: 5,
  },
  separator: {height: 10},
  separatorL: {height: 42},
});

export default App;
