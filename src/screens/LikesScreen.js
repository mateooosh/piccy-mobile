import React, {useState, useEffect} from "react";
import {useStore} from "react-redux";
import {
  Text,
  View,
  ScrollView
} from "react-native";

import {API_URL} from "@env";

import UserItem from "../components/UserItem";


export default function LikesScreen({route, navigation}) {
  const store = useStore();

  // const [profile, setProfile] = useState([]);
  // const [posts, setPosts] = useState([]);

  const [likes, setLikes] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const url = `${API_URL}/likes/${route.params.idPost}?token=${store.getState().token}`;
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setLikes(response);
        setHasData(true);
      })
      .catch((err) => console.log(err));

    return function cleanup() {
      setLikes([]);
    };
  }, [route.params.id]);

  return (
    <ScrollView
      style={{paddingHorizontal: 10, height: "100%", backgroundColor: 'white'}}
    >
      {likes.map((item, idx) => (
        <UserItem item={item} key={idx} navigation={navigation} hideNumberOfFollowers={true}/>
      ))}

      {hasData && likes.length === 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            paddingVertical: 10,
          }}
        >
          <Text>NO ONE LIKES THIS POST</Text>
        </View>
      )}
    </ScrollView>
  );
}
