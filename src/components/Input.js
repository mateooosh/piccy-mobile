import React from 'react';
import {Text, View, TextInput} from 'react-native';
import styles from "../styles/style";


export default function Input({label, placeholder, autoCompleteType, onSubmitEditing, onChangeText, secureTextEntry, isCorrect, errorMessage, value, marginBottom, editable = true}) {

  return (
    <View style={{marginBottom: marginBottom || 0}}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={editable}
        value={value}
        onSubmitEditing={onSubmitEditing}
        onChangeText={(str) => {onChangeText(str);}}
        style={styles.input}
        placeholder={placeholder}
        autoCompleteType={autoCompleteType || null}
        secureTextEntry={secureTextEntry}
      />
      {!isCorrect && value.length !== 0 &&
      <Text style={{color: 'red', position: 'absolute', bottom: -20, fontSize: 12}}>{errorMessage}</Text>
      }
    </View>
  )
}