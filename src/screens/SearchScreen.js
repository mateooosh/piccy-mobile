import React, {useState, useEffect} from 'react';
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_URL, API_URL_WS} from '@env';
import {useStore, useSelector} from "react-redux";

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../colors/colors';
import {t} from "../translations/translations";
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

const TopTab = createMaterialTopTabNavigator();

export default function SearchScreen({navigation}) {
  const [query, setQuery] = useState('');

  function getIcon() {
    if (query.length > 0)
      return <MaterialIcons onPress={() => setQuery('')} name="close" color={'black'} size={30}
                            style={{position: 'absolute', right: 10, top: 8}}/>;
    else
      return;
  }


  return (
    <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 10}}>
        <TextInput
          onChangeText={(str) => setQuery(str)}
          style={{backgroundColor: '#f1f1f1', paddingHorizontal: 20, borderRadius: 15, fontSize: 16, height: 46}}
          placeholder="Type here..."
          value={query}
        />
        {getIcon()}
      </View>
      <TopTab.Navigator
        tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: 'black',
        indicatorStyle: {
          backgroundColor: colors.primary,
        }
      }}>
        <TopTab.Screen name="Accounts" children={() => <SearchAccounts query={query} navigation={navigation}/>}/>
        <TopTab.Screen name="Tags" children={() => <SearchTags query={query} navigation={navigation}/>}/>
      </TopTab.Navigator>

    </View>
  )
}

function SearchAccounts(props) {
  const [result, setResult] = useState([]);
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const [loading, setLoading] = useState(true);


  const [time, setTime] = useState(setTimeout(() => {
  }, 0));

  useEffect(() => {
    clearTimeout(time);
    setTime(setTimeout(getAccounts, 250));
    return () => clearTimeout(time);
  }, [props])

  function getAccounts() {
    const url = `${API_URL}/users/${props.query}?token=${store.getState().token}`;
    console.log(url)
    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log('search accounts: ', response);
        setResult(response);
      })
      .catch(checkError)
      .finally(() => setLoading(false));
  }

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


  return (
    <ScrollView style={{paddingHorizontal: 10, backgroundColor: 'white'}}>
      {loading &&
      <ActivityIndicator size={60} color={colors.primary} style={{marginVertical: 40}}/>
      }
      {result.map((item, idx) =>
        <View key={idx} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 15}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{marginRight: 15}}
            onPress={() => props.navigation.push('Profile', {username: item.username})}
          >
            {item.photo !== null &&
            <Image
              source={{uri: item.photo}}
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            }
            {item.photo === null &&
            <MaterialIcons name="account-circle" color={'black'} size={50}/>
            }
          </TouchableOpacity>

          <View style={{flexGrow: 1}}>
            <Text
              style={{fontWeight: '700', fontSize: 15}}
              onPress={() => props.navigation.push('Profile', {username: item.username})}
            >
              {item.username}
            </Text>
            <Text style={{color: '#555'}}>
              {item.name}
            </Text>
          </View>

          <View>
            <Text style={{fontWeight: '700', fontSize: 15, textAlign: 'center'}}>
              {item.followers}
            </Text>
            <Text style={{color: '#555'}}>
              {t.followers[lang]}
            </Text>
          </View>

        </View>
      )}
    </ScrollView>
  )
}


function SearchTags(props) {
  const [result, setResult] = useState([]);
  const store = useStore();

  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(setTimeout(() => {
  }, 0));

  useEffect(() => {
    console.log('props', props)
    clearTimeout(time);
    setTime(setTimeout(getTags, 250));
    return () => clearTimeout(time);
  }, [props])

  function getTags() {
    const url = `${API_URL}/tags?query=${props.query.replace('#', '')}&token=${store.getState().token}`;
    fetch(url)
      .then(checkStatus)
      .then(response => {
        setResult(response);
      })
      .catch(checkError)
      .finally(() => setLoading(false));
  }

  const lang = useSelector(state => state.lang);

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

  function onTagPress(tag) {
    props.navigation.push('Tag', {tag: tag.replace('#', '')})
  }

  return (
    <ScrollView style={{padding: 20, backgroundColor: 'white'}}>
      {loading &&
      <ActivityIndicator size={60} color={colors.primary} style={{marginVertical: 40}}/>
      }

      {result.map((tag, index) =>
        <Text key={index} onPress={onTagPress.bind(this, tag)} style={{fontSize: 16, color: colors.hashtag, fontWeight: 'bold', marginBottom: 10}}>{tag}</Text>
      )}
    </ScrollView>
  )
}