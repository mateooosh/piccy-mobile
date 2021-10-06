import React, {useState} from 'react';
import {useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import styles from "../styles/style";
import {API_URL} from "@env";
import {validation, displayToast} from '../functions/functions';
import {useToast} from 'native-base';

export default function ReportBugScreen() {
  const store = useStore();
  const toast = useToast();

  const [bugDescription, setBugDescription] = useState('');
  const [loading, setLoading] = useState(false);

  function reportBug() {
    const url = `${API_URL}/report/bug`;
    const obj = {
      idReporter: store.getState().id,
      description: bugDescription,
      token: store.getState().token
    }

    setLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        displayToast(toast, response.message);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        setBugDescription('');
      })
  }

  function disableButton() {
    return validation.min6Chars(bugDescription);
  }

  function getButton() {
    if (disableButton()) {
      return (
        <TouchableOpacity onPress={reportBug} style={styles.button}>
          {!loading &&
          <Text style={styles.button.text}>Report</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={styles.button.text}>Report</Text>
        </TouchableOpacity>
      )
    }
  }

  return (

    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <View>
          <Text style={styles.label}>Describe some observation, event, happening or condition we need to resolve</Text>
          <TextInput
            value={bugDescription}
            onSubmitEditing={reportBug}
            onChangeText={(str) => setBugDescription(str)}
            style={{
              marginTop: 16,
              backgroundColor: '#eee',
              borderRadius: 8,
              paddingHorizontal: 8,
              fontSize: 16,
              paddingVertical: 8,
              marginBottom: 30,
              textAlignVertical: 'top'
            }}
            multiline={true}
            numberOfLines={14}
            placeholder="Bug description"
          />

          {getButton()}
        </View>
      </ScrollView>
    </View>
  )
}
