import {StyleSheet} from "react-native";
import colors from "../colors/colors";

const styles = {
  label: {
    fontWeight: '700',
    fontSize: 16,
    color: '#777'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    // paddingHorizontal: 8,
    fontSize: 16,
    paddingVertical: 8,
    // marginTop: 4,
    // marginBottom: 30,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
    color: 'white'
  },
  buttonDisabled: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ccc',
    color: 'white'
  }
}

export default styles;