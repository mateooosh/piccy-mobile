import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, Image, Dimensions} from 'react-native';
import {useSelector} from "react-redux";
import colors from '../colors/colors';


export default function ProfilePosts({posts, loading, navigation}) {
  const lang = useSelector(state => state.lang);

  return (
    <View style={{width: '100%'}}>
      <Text style={{
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'left',
        paddingLeft: 20,
        marginBottom: 10
      }}>{t.posts[lang]}</Text>
      {posts.length < 1 && loading &&
      <ActivityIndicator
        size={60}
        color={colors.primary}
        style={{marginVertical: 40}}
      />
      }


      {posts.length > 0 && !loading &&
      <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
        {posts.map((post) =>
          <TouchableOpacity
            activeOpacity={0.8}
            key={post.id}
            onPress={() => navigation.push('Post', {id: post.id})}
          >
            <Image
              source={{uri: post.photo}}
              style={{
                width: Dimensions.get('window').width / 3 - 4,
                height: Dimensions.get('window').width / 3 - 4,
                margin: 2
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      }

      {posts.length < 1 && !loading &&
      <View style={{paddingHorizontal: 20}}>
        <Text>{t.userHasNoPosts[lang]}</Text>
      </View>
      }

    </View>
  )
}