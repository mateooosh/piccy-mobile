import React, {useState} from 'react';
import {useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Image, Dimensions} from 'react-native';
import styles from "../styles/style";
import {API_URL} from "@env";
import {validation, displayToast} from '../functions/functions';
import {useToast} from 'native-base';
import {t} from "../translations/translations";
import * as ImagePicker from "expo-image-picker";

export default function ReportBugScreen() {
  const store = useStore();
  const toast = useToast();

  const [attachment, setAttachment] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [bugDescription, setBugDescription] = useState('');
  const [loading, setLoading] = useState(false);

  function reportBug() {
    const url = `${API_URL}/report/bug`;
    const obj = {
      idReporter: store.getState().id,
      description: bugDescription,
      token: store.getState().token,
      attachment: attachment
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
        <TouchableOpacity onPress={reportBug} style={{...styles.button, marginHorizontal: 20}}>
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
        <TouchableOpacity style={{...styles.buttonDisabled, marginHorizontal: 20}}>
          <Text style={styles.button.text}>Report</Text>
        </TouchableOpacity>
      )
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setAttachment(`data:image/webp;base64,${result.base64}`);
      setResolution(result.height / result.width);
    }
  };

  return (

    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingTop: 20}}>
        <View>
          <Text style={{...styles.label, paddingHorizontal: 20}}>Describe some observation, event, happening or condition we need to resolve</Text>
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
              marginBottom: 10,
              marginHorizontal: 20,
              textAlignVertical: 'top',
            }}
            multiline={true}
            numberOfLines={10}
            placeholder="Bug description"
          />

          {attachment &&
          <Image
            source={{uri: attachment}}
            style={{width: Dimensions.get('window').width / 1.5, height: Dimensions.get('window').width * resolution / 1.5,
              marginVertical: 10, marginLeft: 'auto', marginRight: 'auto'
            }}
          />
          }

          <TouchableOpacity
            onPress={pickImage}
            style={{...styles.buttonOutline, marginVertical: 10, marginHorizontal: 20}}
          >
            <Text style={styles.buttonOutline.text}>Attach screenshot</Text>
          </TouchableOpacity>

          {getButton()}
        </View>
      </ScrollView>
    </View>
  )
}
