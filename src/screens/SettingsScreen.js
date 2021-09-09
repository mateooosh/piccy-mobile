import React from 'react';
import { useStore } from 'react-redux';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen(){
  const store = useStore();

  function logOut() {
    store.dispatch({ type: 'logged/false' });
    store.dispatch({ type: 'tokenSet', payload: '' });
    store.dispatch({ type: 'usernameSet', payload: '' });
    store.dispatch({ type: 'idSet', payload: '' });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: 'white' }}>
      <ScrollView  contentContainerStyle={{display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#ddd'}}>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="settings-applications" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="electrical-services" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="drive-folder-upload" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="psychology" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="settings-applications" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="electrical-services" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Report bug</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="drive-folder-upload" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Language</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="psychology" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Reset password</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logOut}>
          <MaterialCommunityIcons style={styles.icon} name="logout" color={'black'} size={30}/>
          <Text style={{fontSize: 16, fontWeight: '700'}}>Log out</Text>
          <MaterialCommunityIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'} size={30}/>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  icon:{
    marginRight: 10,
    color: '#333'
  }
})