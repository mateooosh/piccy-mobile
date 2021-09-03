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
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 20 }}>
      <ScrollView>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="settings-applications" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="electrical-services" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="drive-folder-upload" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="psychology" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="settings-applications" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Option</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="electrical-services" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Report bug</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="drive-folder-upload" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons style={styles.icon} name="psychology" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Reset password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logOut}>
          <MaterialCommunityIcons style={styles.icon} name="logout" color={'black'} size={30}/>
          <Text style={{fontSize: 16, fontWeight: '700'}}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  option: {
    paddingBottom: 20,
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  icon:{
    marginRight: 10
  }
})