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
  AlertDialog, useToast
} from "native-base";

// import colors
import colors from '../colors/colors'

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useSelector, useStore} from "react-redux";
import {API_URL} from "@env";
import {displayToast} from "../functions/functions";
import {t} from "../translations/translations";
import styles from "../styles/style";
import Input from "./Input";


// //import my functions
const fun = require("../functions/functions");

export default function Post(props) {

  const store = useStore();
  const lang = useSelector(state => state.lang);
  const toast = useToast();

  const {isOpen, onOpen, onClose} = useDisclose();
  const fadeAnim = useRef(new Animated.Value(0)).current
  const likeAnim = useRef(new Animated.Value(1)).current

  const [isOpenReport, setIsOpenReport] = useState(false);
  const onCloseReport = () => setIsOpenReport(false);
  const cancelRefReport = useRef();

  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const onCloseRemove = () => setIsOpenRemove(false);
  const cancelRefRemove = useRef();

  const [isOpenComment, setIsOpenComment] = useState(false);
  const onCloseComment = () => setIsOpenComment(false);
  const cancelRefComment = useRef();

  const inputCommentRef = useRef();

  const [post, setPost] = useState({});

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [reason, setReason] = useState('');
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    setPost(props.post);
    console.log(props)

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
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
        useNativeDriver: true
      }
    ).start(() => {
      Animated.timing(
        likeAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
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
      .then(response => {
        let deepCopy = JSON.parse(JSON.stringify(post));
        deepCopy.likes++;
        deepCopy.liked = 1;
        setPost(deepCopy);

        animateHeartIcon();
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
        setIsOpenRemove(!isOpenRemove);
        onClose();
        displayToast(toast, response.message);
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
        displayToast(toast, response.message);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setCommentInput('');
        setIsOpenComment(false);
        getComments(props.post.id);
      })
  }

  useEffect(() => {
    setTimeout(() => {
      if (isOpenComment)
        inputCommentRef.current.focus();
        // console.log(inputCommentRef)
    }, 0)
  }, [isOpenComment])

  function onCommentPress() {
    setIsOpenComment(true);
    // inputCommentRef.current.focus();
  }

  function onSharePress() {
    console.log('share');

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
              setIsOpenRemove(true);
            }}
          >
            <Text style={{fontSize: 16, fontWeight: "600"}}>{t.removePost[lang]}</Text>
          </Actionsheet.Item>
          }
          <Actionsheet.Item
            onPress={() => {
              setIsOpenReport(!isOpenReport);
              onClose();
            }}
          >
            <Text style={{fontSize: 16, fontWeight: "600"}}>{t.reportPost[lang]}</Text>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => {
            onClose();
            alert('download photo')
          }}>
            {t.downloadPhoto[lang]}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>


      {AlertDialogComment(commentInput)}
      {AlertDialogRemovePost()}
      {AlertDialogReportPost()}


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
              color={colors.danger}
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
            onPress={onSharePress}
            name="share"
            color={"black"}
            size={30}
          />
        </View>
      </View>

      <View style={{flexDirection: "row", marginBottom: 10}}>
        <Text style={{marginHorizontal: 15, fontWeight: "700", fontSize: 13}}>
          {post.likes} {t.likes[lang]}
        </Text>
        <Text style={{fontWeight: "700", fontSize: 13}}>
          {post.comments} {t.comments[lang]}
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
          <Text>{t.Comments[lang]}</Text>
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

    </View>
  );

  function AlertDialogComment(comment) {
    function getButton (comment) {
      if(comment.length > 2) {
        return (
          <TouchableOpacity style={{...styles.button, marginLeft: 12}}
                            onPress={createComment}>
            <Text style={styles.button.text}>{t.comment[lang]}</Text>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity style={{...styles.buttonDisabled, marginLeft: 12}}>
            <Text style={styles.button.text}>{t.comment[lang]}</Text>
          </TouchableOpacity>
        )
      }
    }

    return(
      <AlertDialog
        leastDestructiveRef={cancelRefComment}
        isOpen={isOpenComment}
        onClose={onCloseComment}
        motionPreset={"fade"}
      >
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            {t.commentPost[lang]}
          </AlertDialog.Header>
          <AlertDialog.Body>
            <TextInput
              onChangeText={str => setCommentInput(str)}
              onSubmitEditing={createComment}
              ref={inputCommentRef}
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
              placeholder={t.typeHere[lang]}
              value={commentInput}
            />
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <TouchableOpacity style={styles.buttonOutline} ref={cancelRefComment}
                              onPress={onCloseComment}>
              <Text style={styles.buttonOutline.text}>{t.cancel[lang]}</Text>
            </TouchableOpacity>

            {getButton(comment)}
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }

  function AlertDialogRemovePost() {
    return(
      <AlertDialog
        leastDestructiveRef={cancelRefRemove}
        isOpen={isOpenRemove}
        onClose={onCloseRemove}
        motionPreset={"fade"}
      >
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            {t.removePost[lang]}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {t.areYouSureYouWantToRemoveThisPost[lang]}
          </AlertDialog.Body>
          <AlertDialog.Footer>

            <TouchableOpacity style={styles.buttonOutline} ref={cancelRefRemove}
                              onPress={onCloseRemove}>
              <Text style={styles.buttonOutline.text}>{t.cancel[lang]}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.button, marginLeft: 12, backgroundColor: colors.danger}}
                              onPress={removePost}>
              <Text style={styles.button.text}>{t.remove[lang]}</Text>
            </TouchableOpacity>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }

  function AlertDialogReportPost() {
    return(
      <AlertDialog
        leastDestructiveRef={cancelRefReport}
        isOpen={isOpenReport}
        onClose={onCloseReport}
        motionPreset={"fade"}
      >
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            {t.reportPost[lang]}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {t.typeHereWhatIsTheReasonReportPost[lang]}
            <TextInput
              onSubmitEditing={reportPost.bind(this, post.id)}
              onChangeText={(reason) => setReason(reason)}
              style={{
                backgroundColor: "#e9e9e9",
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
            <TouchableOpacity style={styles.buttonOutline} ref={cancelRefReport}
                              onPress={onCloseReport}>
              <Text style={styles.buttonOutline.text}>{t.cancel[lang]}</Text>
            </TouchableOpacity>

            {reason.length > 3 && (
              // <Button
              //   style={{backgroundColor: colors.primary}}
              //   onPress={() => {
              //     reportPost();
              //   }}
              //   ml={3}
              // >
              //   {t.report[lang]}
              // </Button>

              <TouchableOpacity style={{...styles.button, marginLeft: 12}}
                                onPress={reportPost}>
                <Text style={styles.button.text}>{t.report[lang]}</Text>
              </TouchableOpacity>
            )}

            {reason.length <= 3 && (
              <TouchableOpacity style={{...styles.buttonDisabled, marginLeft: 12}}
                                onPress={reportPost}>
                <Text style={styles.button.text}>{t.report[lang]}</Text>
              </TouchableOpacity>
            )}
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    )
  }
}
