import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  ToastAndroid,
  TextInput
} from "react-native";

import {
  Button,
  Actionsheet,
  useDisclose,
  AlertDialog
} from "native-base";


import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useStore, useSelector } from "react-redux";
import { API_URL } from "@env";
console.log(API_URL)

// //import my functions
const fun = require("../functions/functions");

export default function Post(props) {

  const { isOpen, onOpen, onClose } = useDisclose();
  const test = useDisclose();

  const [isOpenAlert, setIsOpenAlert] = React.useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);
  const cancelRefAlert = React.useRef();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [reason, setReason] = useState('');

  const store = useStore();

  useEffect(() => {
    setPost(props.post);

    if(props.displayComments) {
      const url = `http://localhost:3000/comments/${props.post.id}`;
      
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log('comments', response);
          setComments(response);
        })
        .catch((err) => console.log(err));
    }

  }, [props])

  function likePost(idUser, idPost, index) {
    const url = `${API_URL}/likes`;
    console.log(JSON.stringify({ idUser: idUser, idPost: idPost }));
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ idUser: idUser, idPost: idPost }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let deepCopy = JSON.parse(JSON.stringify(post));
        deepCopy.likes++;
        deepCopy.liked = 1;
        setPost(deepCopy);

        // ToastAndroid.showWithGravityAndOffset(
        //   "Liked",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM,
        //   0,
        //   150
        // );
        // alert(response.message);
      })
      .catch((err) => console.log(err));
  }

  function dislikePost(idUser, idPost, index) {
    const url = `${API_URL}/likes`;
    fetch(url, {
      method: "DELETE",
      body: JSON.stringify({ idUser: idUser, idPost: idPost }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let deepCopy = JSON.parse(JSON.stringify(post));
        deepCopy.likes--;
        deepCopy.liked = 0;
        setPost(deepCopy);

        ToastAndroid.showWithGravityAndOffset(
          "Disliked",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          150
        );
      })
      .catch((err) => console.log(err));
  }

  function reportPost() {
    const url = `http://localhost:3000/reports`;
    const obj = {
      idPost: post.id,
      idReporter: store.getState().id,
      reason: reason
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.message);
    })
    .catch(err => console.log(err))
    .finally(() => setIsOpenAlert(false))


  }

  return (
    <View
      key={post.id}
      style={{
        marginBottom: 10,
        backgroundColor: "white",
        paddingVertical: 12,
      }}
    >
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              setIsOpenAlert(!isOpenAlert);
              onClose();
            }}
          >
            Report post
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={async () => {
              await FileSystem.downloadAsync(
                post.photo,
                FileSystem.documentDirectory + "photo"
              );
            }}
          >
            Download photo
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelRefAlert}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
        motionPreset={"fade"}
      >
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Report post
          </AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure You want to report this post?
            <TextInput
              onSubmitEditing={reportPost.bind(this, post.id)}
              onChangeText={(reason) => setReason(reason)}
              style={{
                backgroundColor: "#ddd",
                paddingHorizontal: 15,
                borderRadius: 10,
                fontSize: 16,
                paddingVertical: 8,
                marginTop: 10,
              }}
              placeholder="Reason"
            />
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              style={{ backgroundColor: "#2196F3" }}
              ref={cancelRefAlert}
              onPress={onCloseAlert}
            >
              Cancel
            </Button>

            {reason.length > 3 && (
              <Button
                style={{ backgroundColor: "#2196F3" }}
                onPress={() => {
                  console.log("report");
                  reportPost();
                }}
                ml={3}
              >
                Report
              </Button>
            )}

            {reason.length <= 3 && (
              <Button
                style={{ backgroundColor: "#ccc" }}
                ml={3}
              >
                Report
              </Button>
            )}

          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          marginHorizontal: 15,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ marginRight: 15 }}
          onPress={() =>
            props.navigation.navigate("Profile", {
              username: post.username,
            })
          }
        >
          {post.userPhoto !== null && (
            <Image
              source={{ uri: post.userPhoto }}
              style={{ width: 40, height: 40, borderRadius: 50 }}
            />
          )}
          {post.userPhoto === null && (
            <MaterialIcons name="account-circle" color={"black"} size={40} />
          )}
        </TouchableOpacity>

        <View style={{ flexGrow: 1 }}>
          <Text
            style={{ fontWeight: "700", fontSize: 15 }}
            onPress={() =>
              props.navigation.navigate("Profile", {
                username: post.username,
              })
            }
          >
            {post.username}
          </Text>
          <Text style={{ fontWeight: "500", fontSize: 12, color: "#777" }}>
            {fun.displayTime(post.uploadDate)}
          </Text>
        </View>
        <TouchableOpacity onPress={onOpen}>
          <MaterialCommunityIcons
            name="dots-vertical"
            color={"black"}
            size={32}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate("Post", { id: post.id })}
      >
        <Image
          source={{ uri: post.photo }}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").width,
          }}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          justifyContent: "space-around",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {post.liked === 0 && (
            <MaterialCommunityIcons
              onPress={likePost.bind(
                this,
                store.getState().id,
                post.id,
                props.idx
              )}
              name="heart-outline"
              color={"black"}
              size={30}
            />
          )}

          {post.liked === 1 && (
            <MaterialCommunityIcons
              onPress={dislikePost.bind(
                this,
                store.getState().id,
                post.id,
                props.idx
              )}
              name="heart"
              color={"#E40000"}
              size={30}
            />
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            onPress={() => alert("Comment")}
            name="comment-outline"
            color={"black"}
            size={30}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            onPress={() => alert("Share")}
            name="share"
            color={"black"}
            size={30}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Text style={{ marginHorizontal: 15, fontWeight: "700", fontSize: 13 }}>
          {post.likes} likes
        </Text>
        <Text style={{ fontWeight: "700", fontSize: 13 }}>
          {post.comments} comments
        </Text>
      </View>

      <Text style={{ marginHorizontal: 15, fontSize: 13 }}>
        <Text
          style={{ fontWeight: "700" }}
          onPress={() =>
            props.navigation.navigate("Profile", {
              username: post.username,
            })
          }
        >
          {post.username + " "}
        </Text>

        {props.post.description.split(" ").map((word, index) => {
          if (word.charAt(0) === "#")
            return (
              <Text
                key={index}
                onPress={() => alert(`push to ${word} tag`)}
                style={{ color: "#1F72FF" }}
              >
                {word}{" "}
              </Text>
            );
          else return <Text key={index}>{word} </Text>;
        })}
      </Text>

      {props.displayComments === true && comments.length > 0 && (
        <Text style={{ color: "#555", marginHorizontal: 15, marginTop: 10 }}>
          <Text>Comments</Text>
        </Text>
      )}

      {props.displayComments &&
        comments.map((comment, idx) => (
          <View
            key={idx}
            style={{
              marginHorizontal: 15,
              marginVertical: 2,
              display: "block",
            }}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 13, marginRight: 5 }}
              onPress={() =>
                props.navigation.push("Profile", {
                  username: comment.username,
                })
              }
            >
              {comment.username}
            </Text>
            <Text style={{ fontSize: 13 }}>{comment.content}</Text>
          </View>
        ))}
    </View>
  );
}
