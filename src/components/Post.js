import React, {useState, useEffect, useRef} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ToastAndroid,
  TextInput,
  Animated
} from "react-native";

import {
  Button,
  Actionsheet,
  useDisclose,
  AlertDialog
} from "native-base";

// import colors
import colors from '../colors/colors'


import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useStore} from "react-redux";
import {API_URL} from "@env";
import styles from "../styles/style";


// //import my functions
const fun = require("../functions/functions");

export default function Post(props) {

  const {isOpen, onOpen, onClose} = useDisclose();
  const fadeAnim = useRef(new Animated.Value(0)).current
  const likeAnim = useRef(new Animated.Value(1)).current

  const [isOpenReport, setIsOpenReport] = React.useState(false);
  const onCloseReport = () => setIsOpenReport(false);
  const cancelRefReport = React.useRef();

  const [isOpenRemove, setIsOpenRemove] = React.useState(false);
  const onCloseRemove = () => setIsOpenRemove(false);
  const cancelRefRemove = React.useRef();

  // const [isOpenRemovePost, setIsOpenRemovePost] = React.useState(false);
  // const onCloseRemovePost = () => setIsOpenRemovePost(false);
  const [post, setPost] = useState({});

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [reason, setReason] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [commentInputVisible, setCommentInputVisible] = useState(true);

  const store = useStore();

  useEffect(() => {
    setPost(props.post);
    console.log(props)

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
      }
    ).start();


    getPhoto(props.post.id);

    getComments(props.post.id);

    return function cleanup() {
      console.log('destroy')
    }

  }, [])

  function animateHeartIcon() {
    Animated.timing(
      likeAnim,
      {
        toValue: 1.4,
        duration: 300,
      }
    ).start(() => {
      Animated.timing(
        likeAnim,
        {
          toValue: 1,
          duration: 500
        }
      ).start();
    });
  }

  function likePost(idUser, idPost, index) {
    const url = `${API_URL}/likes`;
    console.log(JSON.stringify({idUser: idUser, idPost: idPost}));
    fetch(url, {
      method: "POST",
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
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

        animateHeartIcon();

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
      body: JSON.stringify({idUser: idUser, idPost: idPost, token: store.getState().token}),
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

  function getPhoto(id) {
    const url = `${API_URL}/posts/${id}/photo?token=${store.getState().token}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('photo', response);
        setPhoto(response.photo);
      })
      .catch(err => console.log(err))
  }

  function getComments(id) {
    if (!props.homeScreen) {
      const url = `${API_URL}/comments/${id}?token=${store.getState().token}`;
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log('comments', response);
          setComments(response);
        })
        .catch((err) => console.log(err));
    }
  }

  function reportPost() {
    const url = `${API_URL}/reports`;
    const obj = {
      idPost: post.id,
      idReporter: store.getState().id,
      reason: reason,
      token: store.getState().token
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message);
      })
      .catch(err => console.log(err))
      .finally(() => setIsOpenReport(false))
  }

  function removePost() {
    const url = `${API_URL}/posts/${post.id}`;
    fetch(url, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => alert(err))
  }

  function createComment() {
    const url = `${API_URL}/comments/${post.id}`;
    const obj = {
      idUser: store.getState().id,
      content: commentInput,
      token: store.getState().token
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
      .finally(() => {
        setCommentInput('');
        getComments(props.post.id);
      })
  }

  function onCommentPress() {
    console.log('comment press');
  }

  return (
    <View
      key={post.id}
      style={{
        marginBottom: 8,
        backgroundColor: "white",
        paddingVertical: 12,
        borderRadius: 5
      }}
    >
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {post.username === store.getState().username &&
          <Actionsheet.Item
            onPress={() => {
              setIsOpenRemove(!isOpenRemove);
              onClose();
            }}
          >
            <Text style={{fontSize: 16, fontWeight: "600"}}>Remove post</Text>
          </Actionsheet.Item>
          }
          <Actionsheet.Item
            onPress={() => {
              setIsOpenReport(!isOpenReport);
              onClose();
            }}
          >
            <Text style={{fontSize: 16, fontWeight: "600"}}>Report post</Text>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => {
            onClose();
            alert('download photo')
          }}>
            Download photo
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelRefRemove}
        isOpen={isOpenRemove}
        onClose={onCloseRemove}
        motionPreset={"fade"}
      >
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Remove post
          </AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure You want to remove this post?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              style={{backgroundColor: colors.primary}}
              ref={cancelRefRemove}
              onPress={onCloseRemove}
            >
              Cancel
            </Button>

            <Button
              style={{backgroundColor: colors.danger}}
              onPress={() => {
                console.log("remove");
                removePost();
              }}
              ml={3}
            >
              Remove
            </Button>

          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog
        leastDestructiveRef={cancelRefReport}
        isOpen={isOpenReport}
        onClose={onCloseReport}
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
                textAlignVertical: 'top'
              }}
              multiline={true}
              numberOfLines={4}
              placeholder="Reason"
            />
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              style={{backgroundColor: colors.primary}}
              ref={cancelRefReport}
              onPress={onCloseReport}
            >
              Cancel
            </Button>

            {reason.length > 3 && (
              <Button
                style={{backgroundColor: colors.primary}}
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
              <Button style={{backgroundColor: "#ccc"}} ml={3}>
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
          style={{marginRight: 15, position: "relative"}}
          onPress={() =>
            props.navigation.navigate("Profile", {
              username: post.username,
            })
          }
        >
          {post.userPhoto !== null && (
            <Image
              source={{uri: post.userPhoto}}
              style={{width: 40, height: 40, borderRadius: 50}}
            />
          )}
          {post.userPhoto === null && (
            <MaterialIcons name="account-circle" color={"black"} size={40}/>
          )}
        </TouchableOpacity>

        <View style={{flexGrow: 1}}>
          <Text
            style={{fontWeight: "700", fontSize: 15}}
            onPress={() =>
              props.navigation.navigate("Profile", {
                username: post.username,
              })
            }
          >
            {post.username}
          </Text>
          <Text style={{fontWeight: "500", fontSize: 12, color: "#777"}}>
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
        onPress={() => props.navigation.navigate("Post", {id: post.id})}
      >
        <View style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").width,
          backgroundColor: '#eee'
        }}>
          <Animated.Image
            source={{uri: photo}}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width,
              opacity: fadeAnim
            }}
          />
        </View>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          justifyContent: "space-around"
        }}
      >
        <Animated.View style={{flexDirection: "row", alignItems: "center", transform: [{scale: likeAnim}]}}>
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
        </Animated.View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <MaterialCommunityIcons
            onPress={onCommentPress}
            name="comment-outline"
            color={"black"}
            size={30}
          />
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <MaterialIcons
            onPress={() => alert("Share")}
            name="share"
            color={"black"}
            size={30}
          />
        </View>
      </View>

      <View style={{flexDirection: "row", marginBottom: 10}}>
        <Text style={{marginHorizontal: 15, fontWeight: "700", fontSize: 13}}>
          {post.likes} likes
        </Text>
        <Text style={{fontWeight: "700", fontSize: 13}}>
          {post.comments} comments
        </Text>
      </View>

      <Text style={{marginHorizontal: 15, fontSize: 13}}>
        <Text
          style={{fontWeight: "700"}}
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
                style={{color: colors.hashtag, fontWeight: "600"}}
              >
                {word}{" "}
              </Text>
            );
          else return <Text key={index}>{word} </Text>;
        })}
      </Text>

      {props.homeScreen === false && comments.length > 0 && (
        <Text style={{color: "#555", marginHorizontal: 15, marginTop: 10}}>
          <Text>Comments</Text>
        </Text>
      )}

      {comments.map((comment, idx) => (
        <View
          onPress={() =>
            props.navigation.push("Profile", {
              username: comment.username,
            })
          }
          key={idx}
          style={{
            marginHorizontal: 15,
            marginVertical: 4,
          }}
        >
          <Text style={{fontWeight: "700", fontSize: 13, marginRight: 5}}>{comment.username}
            <Text style={{fontSize: 13, fontWeight: "500"}}> {comment.content}</Text>
          </Text>
        </View>
      ))}

      {!props.homeScreen && commentInputVisible &&
      <View style={{position: 'relative', marginBottom: 10, marginTop: 8, marginHorizontal: 10}}>
        <TextInput
          onChangeText={str => setCommentInput(str)}
          onSubmitEditing={createComment}
          style={{
            minHeight: 46,
            flexGrow: 1,
            backgroundColor: '#eee',
            paddingLeft: 8,
            paddingRight: 50,
            fontSize: 16,
            borderRadius: 12,
            paddingVertical: 8,
          }}
          placeholder="Type here..."
          value={commentInput}
        />
        <TouchableOpacity style={{position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)'}}
                          onPress={createComment}>
          <MaterialIcons name="send" color={'#444'} size={35}/>
        </TouchableOpacity>
      </View>
      }
    </View>
  );
}
