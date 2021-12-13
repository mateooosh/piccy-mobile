import React, {useState, useEffect} from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator, Dimensions
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import colors from "../colors/colors";
import {t} from "../translations/translations";
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

export default function TagScreen({route, navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = `${API_URL}/tag/posts?tag=${route.params.tag}&token=${store.getState().token}`;
    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log(response);
        setImages(response);
      })
      .catch(checkError)
      .finally(() => setLoading(false));

  }, [])

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
    <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        // refreshControl={
        //   <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]}/>
        // }
      >
        {loading && (
          <ActivityIndicator
            size={60}
            color={colors.primary}
            style={{marginVertical: 40}}
          />
        )}

        {images.length < 1 && !loading &&
        <View style={{padding: 20}}>
          <Text>{t.thereAreNoPosts[lang]}</Text>
        </View>
        }

        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
          {images.map((item, index) =>
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              onPress={() => navigation.push('Post', {id: item.id})}
            >
              <Image
                source={{uri: item.photo}}
                style={{
                  width: Dimensions.get('window').width / 2 - 4,
                  height: Dimensions.get('window').width / 2 - 4,
                  margin: 2
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
