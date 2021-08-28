import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { API_URL } from "@env";
import { useStore, useSelector } from "react-redux";
import colors from "../colors/colors";

export default function AccountScreen({ route, navigation }) {
  const store = useStore();
  useEffect(() => {
    console.log(route.params.username);
  }, []);
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //if this is my account
    if (route.params.username === store.getState().username) {
      console.log("teraz");
      navigation.navigate("Home", { screen: "account" });
      return;
    } else {
      // get information about profile
      const url = `${API_URL}/users?username=${route.params.username}&myIdUser=${store.getState().id}`;
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          // console.log(response);
          setProfile(response);

          // get user's posts
          fetch(
            `${API_URL}/posts?username=${route.params.username}&onlyUserPosts=true`
          )
            .then((response) => response.json())
            .then((response) => {
              // console.log(response);
              setPosts(response);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //follow user
  function follow(idUser, idFollower) {
    console.log(idUser, idFollower);

    let deepCopy = JSON.parse(JSON.stringify(profile));
    deepCopy[0].amIFollowing = 1;
    deepCopy[0].followers++;
    setProfile(deepCopy);

    const url = `${API_URL}/users/${idUser}/follow/${idFollower}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.message);
      })
      .catch((err) => console.log(err));
  }

  // unfollow user
  function unfollow(idUser, idFollower) {
    let deepCopy = JSON.parse(JSON.stringify(profile));
    deepCopy[0].amIFollowing = 0;
    deepCopy[0].followers--;
    setProfile(deepCopy);

    const url = `${API_URL}/users/${idUser}/follow/${idFollower}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.message);
      })
      .catch((err) => console.log(err));
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {profile.map((item) => (
        <ScrollView
          key={item.id}
          style={{ paddingTop: 10, width: "100%" }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {item.photo !== null && (
            <Image
              source={{ uri: item.photo }}
              style={{ width: 150, height: 150, borderRadius: 150, margin: 10 }}
            />
          )}
          {item.photo === null && (
            <MaterialIcons
              name="account-circle"
              color={"black"}
              size={150}
              style={{ margin: 10 }}
            />
          )}

          <Text style={{ fontWeight: "700", fontSize: 16 }}>
            {item.username}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 15,
              padding: 10,
            }}
          >
            <View style={{width: '31%', backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}>
              <View><Text style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                color: colors.main
              }}>{item.postsAmount}</Text></View>
              <View><Text style={{textAlign: 'center', fontSize: 16}}>Posts</Text></View>
            </View>
            <TouchableOpacity
              style={{width: '31%', backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}
              onPress={() => navigation.push('Followers', {id: item.id})}
            >
              <View><Text style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                color: colors.main
              }}>{item.followers}</Text></View>
              <View><Text style={{textAlign: 'center', fontSize: 16}}>Followers</Text></View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '31%', backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}
              onPress={() => navigation.push('Following', {id: item.id})}
            >
              <View><Text style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                color: colors.main
              }}>{item.following}</Text></View>
              <View><Text style={{textAlign: 'center', fontSize: 16}}>Following</Text></View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              textAlign: "left",
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 14 }}>{item.description}</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {item.amIFollowing === 0 && (
                <TouchableOpacity
                  onPress={follow.bind(this, store.getState().id, item.id)}
                  style={{
                    paddingVertical: 6,
                    width: "48%",
                    backgroundColor: "#2196F3",
                    borderRadius: 6,
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    Follow
                  </Text>
                </TouchableOpacity>
              )}
              {item.amIFollowing === 1 && (
                <TouchableOpacity
                  onPress={unfollow.bind(this, store.getState().id, item.id)}
                  style={{
                    paddingVertical: 6,
                    width: "48%",
                    backgroundColor: "#ccc",
                    borderRadius: 6,
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    Following
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => alert("send message")}
                style={{
                  paddingVertical: 6,
                  width: "48%",
                  backgroundColor: "#2196F3",
                  borderRadius: 6,
                  marginVertical: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                textAlign: "left",
                paddingLeft: 20,
                marginBottom: 10,
              }}
            >
              Posts
            </Text>
            {posts.length < 1 && (
              <ActivityIndicator
                size={60}
                color="#2196F3"
                style={{ marginVertical: 40 }}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {posts.map((post) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={post.id}
                  onPress={() => navigation.push("Post", { id: post.id })}
                >
                  <Image
                    source={{ uri: post.photo }}
                    style={{
                      width: Dimensions.get("window").width / 3 - 4,
                      height: Dimensions.get("window").width / 3 - 4,
                      margin: 2,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ))}
    </View>
  );
}
