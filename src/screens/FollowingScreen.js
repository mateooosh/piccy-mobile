import React, {useState, useEffect} from 'react';
import {useSelector, useStore} from "react-redux";
import {Text, View, ScrollView, ActivityIndicator} from 'react-native';

import {API_URL} from '@env';

import UserItem from '../components/UserItem';
import colors from "../colors/colors";
import {useToast} from "native-base";
import {checkStatus, displayToast} from "../functions/functions";
import {t} from "../translations/translations";
import Toast from "react-native-toast-message";

export default function FollowingScreen({route, navigation}) {
  const store = useStore();

  const [following, setFollowing] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);
  const lang = useSelector(state => state.lang);

  const toast = useToast();

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
    const url = `${API_URL}/following/${route.params.id}?token=${store.getState().token}`;

    setLoading(true);
    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log(response);
        setFollowing(response);
        setHasData(true);
      })
      .catch(checkError)
      .finally(() => setLoading(false));

    return function cleanup() {
      setFollowing([]);
    }
  }, [route.params.id])


  return (
    <ScrollView style={{paddingHorizontal: 10, height: '100%', backgroundColor: 'white'}}>
      {following.map((item, idx) =>
        <UserItem item={item} key={idx} navigation={navigation}/>
      )}

      {loading && (
        <ActivityIndicator
          size={60}
          color={colors.primary}
          style={{marginVertical: 40}}
        />
      )}

      {hasData && following.length === 0 &&
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingVertical: 10
      }}>
        <Text>NO ONE IS FOLLOWING BY THIS USER</Text>
      </View>
      }
    </ScrollView>
  )
}