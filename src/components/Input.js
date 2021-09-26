import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors';
import styles from "../styles/style";


export default function Input({label, placeholder, autoCompleteType, onSubmitEditing, onChangeText, secureTextEntry, isCorrect, errorMessage, value, marginBottom}) {

  // const [value, setValue] = useState('');

  return (
    <View style={{marginBottom: marginBottom || 0}}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onSubmitEditing={onSubmitEditing}
        onChangeText={(str) => {onChangeText(str);}}
        style={styles.input}
        placeholder={placeholder}
        autoCompleteType={autoCompleteType || null}
        secureTextEntry={secureTextEntry}
      />
      {!isCorrect && value.length !== 0 &&
      <Text style={{color: 'red', position: 'absolute', top: 62, fontSize: 12}}>{errorMessage}</Text>
      }
    </View>
  )
}