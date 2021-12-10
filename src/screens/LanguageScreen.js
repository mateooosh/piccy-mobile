import React from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';

import {Divider} from 'react-native-elements';

import styles from '../styles/style';
import {t} from "../translations/translations";

export default function LanguageScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  function getStyles(v) {
    if (v === lang) {
      return {
        ...styles.option,
        ...styles.optionActive
      }
    } else {
      return styles.option
    }
  }

  function getStylesText(v) {
    if (v === lang) {
      return {fontSize: 16, color: 'white'}
    } else {
      return {fontSize: 16, color: 'black'}
    }
  }

  function setLangInStore(v) {
    store.dispatch({type: "langSet", payload: v});
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: 'white'}}>
      <ScrollView>
        <TouchableOpacity onPress={setLangInStore.bind(this, 'en')} style={getStyles('en')}>
          <Image source={{uri: 'https://flagcdn.com/gb.svg'}} style={{width: 44, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('en')}>{t.english[lang]}</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'pl')} style={getStyles('pl')}>
          <Image source={{uri: 'https://flagcdn.com/pl.svg'}} style={{width: 44, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('pl')}>{t.polish[lang]}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}