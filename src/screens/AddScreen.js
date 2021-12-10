import React, {useState, useEffect, useRef} from 'react';
import {Text, TextInput, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useStore} from 'react-redux';
import styles from "../styles/style";
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {API_URL} from '@env';
import {checkStatus, displayToast} from "../functions/functions";
import {t} from "../translations/translations";
import {useToast} from "native-base";
import Toast from "react-native-toast-message";

export default function AddScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);
  const toast = useToast();

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [loaded, setLoaded] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [flash, setFlash] = useState('off');

  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const [sending, setSending] = useState(false);

  const camera = useRef(null);
  const scrollRef = useRef(null);

  function checkError(err) {
    if(err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });
    }
    else
      console.log(err);
  }

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    navigation.addListener('focus', () => {
      setLoaded(true);
      return function cleanupListener() {
        window.removeEventListener('focus');
      }
    })

    navigation.addListener('blur', () => {
      setLoaded(false)
      setCameraVisible(true);
      setPhoto(null);
      return function cleanupListener() {
        window.removeEventListener('blur');
      }
    })
  }, []);

  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  function toggleType() {
    if (type === Camera.Constants.Type.back) {
      setType(Camera.Constants.Type.front);
    } else if (type === Camera.Constants.Type.front) {
      setType(Camera.Constants.Type.back);
    }
  }

  function setNextFlashMode() {
    if (flash === 'off')
      setFlash('torch');
    else if (flash === "torch")
      setFlash('on');
    else if (flash === "on")
      setFlash('auto');
    else if (flash === 'auto')
      setFlash('off');
  }

  async function takePicture() {
    console.log('photo')
    await camera.current.takePictureAsync({
      base64: true,
    }).then(data => {
      if (data.base64.includes(","))
        setPhoto(data.base64);
      else
        setPhoto("data:image/webp;base64," + data.base64)
    });

    setCameraVisible(false);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setPhoto(`data:image/webp;base64,${result.base64}`);
      setCameraVisible(false);
    }
  };


  async function createPost() {
    console.log('create post');
    const index = photo.indexOf(',');
    let base64 = photo.slice(index + 1, (photo.length));

    let obj = {
      idUser: store.getState().id,
      description: description,
      photo: base64,
      token: store.getState().token
    };

    setSending(true);
    const url = `${API_URL}/posts`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(checkStatus)
      .then(response => {
        Toast.show({
          type: 'success',
          text1: t.success[lang],
          text2: response?.message[lang]
        });
        navigation.push('Piccy', {screen: 'account'});
      })
      .catch(checkError)
      .finally(() => setSending(true))
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        ref={scrollRef}
        contentContainerStyle={{width: '100%', paddingBottom: 5}}
      >
        {photo &&
        <View>
          <Image
            source={{uri: photo}}
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width, marginBottom: 20}}
          />
          <Text style={{fontWeight: '700', fontSize: 16, marginHorizontal: 16}}>{t.caption[lang]}</Text>
          <TextInput
            style={{
              backgroundColor: '#eee',
              marginHorizontal: 16,
              paddingVertical: 5,
              marginBottom: 20,
              marginTop: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
              textAlignVertical: 'top'
            }}
            multiline={true}
            numberOfLines={3}
            value={description}
            onChangeText={(str) => {
              setDescription(str);
              console.log(description);
            }}
            placeholder={t.typeHere[lang]}
          />
          {!sending ? (
            <TouchableOpacity
              onPress={createPost}
              style={{...styles.button, marginVertical: 5, marginHorizontal: 16}}
            >
              <Text style={styles.button.text}>{t.addNewPost[lang]}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={createPost}
              style={{...styles.button, marginVertical: 5, marginHorizontal: 16}}
            >
              <ActivityIndicator size={19} color="white"/>
            </TouchableOpacity>
          )}


        </View>
        }

        {loaded && cameraVisible && (
          <View style={{positon: 'relative', marginBottom: 10}}>
            <Camera
              whiteBalance="auto"
              autoFocus="on"
              ref={camera}
              style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width}}
              type={type}
              ratio="1:1"
              flashMode={flash}
            >
            </Camera>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              width: '100%',
              position: 'absolute',
              bottom: 0
            }}>
              <TouchableOpacity
                onPress={toggleType}
                style={{
                  opacity: 0.9,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 15,
                }}
              >
                <MaterialIcons
                  name="refresh"
                  color={'white'}
                  size={40}
                />
              </TouchableOpacity>


              <TouchableOpacity
                onPress={takePicture}
                style={{
                  opacity: 0.9,
                  padding: 10,
                }}
              >
                <MaterialIcons name="photo-camera" color={'white'} size={80}/>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={setNextFlashMode}
                style={{
                  opacity: 0.9,
                  marginVertical: 10,
                  padding: 10,
                }}
              >
                {flash === 'off' ? (
                  <MaterialIcons name="flash-off" color={'white'} size={40}/>
                ) : (<></>)
                }
                {flash === 'torch' ? (
                  <MaterialCommunityIcons name="flashlight" color={'white'} size={40}/>
                ) : (<></>)
                }
                {flash === 'on' ? (
                  <MaterialIcons name="flash-on" color={'white'} size={40}/>
                ) : (<></>)
                }
                {flash === 'auto' ? (
                  <MaterialIcons name="flash-auto" color={'white'} size={40}/>
                ) : (<></>)
                }
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!cameraVisible &&
        <TouchableOpacity
          onPress={() => {
            setCameraVisible(true);
            setPhoto(null);
          }}
          style={{...styles.buttonOutline, marginVertical: 5, marginHorizontal: 16}}
        >
          <Text style={styles.buttonOutline.text}>{t.takePictureAgain[lang]}</Text>
        </TouchableOpacity>
        }

        <TouchableOpacity
          onPress={pickImage}
          style={{...styles.buttonOutline, marginVertical: 5, marginHorizontal: 16}}
        >
          <Text style={styles.buttonOutline.text}>{t.pickAnImage[lang]}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}