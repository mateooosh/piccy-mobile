import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator, Image, Dimensions} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors';


export default function ProfilePosts({posts, loading, navigation}) {

  return (
    <View style={{width: '100%'}}>
      <Text style={{
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'left',
        paddingLeft: 20,
        marginBottom: 10
      }}>Posts</Text>
      {posts.length < 1 && loading &&
      <ActivityIndicator
        size={60}
        color={colors.main}
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
        <Text>User has no posts</Text>
      </View>
      }

    </View>
  )
}