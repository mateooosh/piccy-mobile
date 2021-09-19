import React from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';

import {Divider} from 'react-native-elements';

import styles from '../styles/style';

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
        <TouchableOpacity onPress={setLangInStore.bind(this, 'de')} style={getStyles('de')}>
          <Image source={{uri: 'https://www.countryflags.io/de/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('de')}>German</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'es')} style={getStyles('es')}>
          <Image source={{uri: 'https://www.countryflags.io/es/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('es')}>Spanish</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'en')} style={getStyles('en')}>
          <Image source={{uri: 'https://www.countryflags.io/gb/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('en')}>English</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'it')} style={getStyles('it')}>
          <Image source={{uri: 'https://www.countryflags.io/it/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('it')}>Italian</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'fr')} style={getStyles('fr')}>
          <Image source={{uri: 'https://www.countryflags.io/fr/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('fr')}>French</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'pl')} style={getStyles('pl')}>
          <Image source={{uri: 'https://www.countryflags.io/pl/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('pl')}>Polish</Text>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity onPress={setLangInStore.bind(this, 'ru')} style={getStyles('ru')}>
          <Image source={{uri: 'https://www.countryflags.io/ru/flat/64.png'}} style={{width: 40, height: 30, marginRight: 12}}/>
          <Text style={getStylesText('ru')}>Russian</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}