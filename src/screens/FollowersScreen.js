import React, {useState, useEffect} from "react";
import {useStore} from "react-redux";
import {
  Text,
  View,
  ScrollView, ActivityIndicator
} from "react-native";

import {API_URL} from "@env";

import UserItem from "../components/UserItem";
import colors from "../colors/colors";


export default function FollowersScreen({route, navigation}) {
  const store = useStore();

  // const [profile, setProfile] = useState([]);
  // const [posts, setPosts] = useState([]);

  const [followers, setFollowers] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `${API_URL}/followers/${route.params.id}?token=${store.getState().token}`;

    setLoading(true)
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setFollowers(response);
        setHasData(true);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    return function cleanup() {
      setFollowers([]);
    };
  }, [route.params.id]);

  return (
    <ScrollView
      style={{paddingHorizontal: 10, height: "100%", backgroundColor: 'white'}}
    >
      {followers.map((item, idx) => (
        <UserItem item={item} key={idx} navigation={navigation}/>
      ))}

      {loading && (
        <ActivityIndicator
          size={60}
          color={colors.primary}
          style={{marginVertical: 40}}
        />
      )}

      {hasData && followers.length === 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            paddingVertical: 10,
          }}
        >
          <Text>NO ONE FOLLOWING THIS USER</Text>
        </View>
      )}
    </ScrollView>
  );
}
