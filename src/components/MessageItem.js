import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from "react-redux";
import colors from '../colors/colors';

import fun from '../functions/functions';
import {Collapse} from "native-base";
import {t} from '../translations/translations';

export default React.memo(MessageItem);

function MessageItem({item, navigation}) {
  const id = useSelector(state => state.id);
  const lang = useSelector(state => state.lang);
  const [displayTime, setDisplayTime] = useState(false);

  return (
    <View>
      {item.idSender == id && (
        <View style={{alignItems: 'flex-end'}}>
          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              fontSize: 12,
              color: '#999'
            }}>
              {fun.displayTimeV2(item.createdAt)}
            </Text>
          </Collapse>

          <TouchableOpacity activeOpacity={1} onPress={() => setDisplayTime(!displayTime)} style={{
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: colors.primary,
            marginVertical: 5,
            textAlign: 'left'
          }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                maxWidth: Dimensions.get('window').width * 3 / 5
              }}
            >
              {item.message.startsWith('LINKTOPOST') ? (
                <Text style={{textDecorationLine: 'underline'}}
                      onPress={() => navigation.push('Post', {id: item.message.split('|')[1]})}>{t.linkToPost[lang]}</Text>
              ) : (
                item.message
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {item.idSender != id && (
        <View style={{alignItems: 'flex-start'}}>
          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              fontSize: 12,
              color: '#999'
            }}>
              {fun.displayTimeV2(item.createdAt)}
            </Text>
          </Collapse>

          <TouchableOpacity activeOpacity={1} onPress={() => setDisplayTime(!displayTime)} style={{
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: '#eee',
            marginVertical: 5,
            textAlign: 'left'
          }}>
            <Text style={{
              color: 'black',
              fontSize: 16,
              maxWidth: Dimensions.get('window').width * 3 / 5
            }}>
              {item.message.startsWith('LINKTOPOST') ? (
                <Text style={{textDecorationLine: 'underline'}}
                      onPress={() => navigation.push('Post', {id: item.message.split('|')[1]})}>{t.linkToPost[lang]}</Text>
              ) : (
                item.message
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  )
}