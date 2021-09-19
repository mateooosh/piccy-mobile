import React from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {Divider} from "react-native-elements";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/style';

import {t} from '../translations/translations';


export default function SettingsScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  function logOut() {
    store.dispatch({type: 'logged/false'});
    store.dispatch({type: 'tokenSet', payload: ''});
    store.dispatch({type: 'usernameSet', payload: ''});
    store.dispatch({type: 'idSet', payload: ''});
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: 'white'}}>
      <ScrollView>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="account-remove" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Delete account</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ReportBug')}>
          <MaterialIcons style={styles.icon} name="bug-report" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Report bug</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('Language')}>
          <MaterialIcons style={styles.icon} name="language" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>{t.language[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ResetPassword')}>
          <MaterialIcons style={styles.icon} name="lock-outline" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>{t.resetPassword[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={logOut}>
          <MaterialIcons style={styles.icon} name="logout" color={'black'} size={30}/>
          <Text style={{fontSize: 16, fontWeight: '700'}}>{t.logOut[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
