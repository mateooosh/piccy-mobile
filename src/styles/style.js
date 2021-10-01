import colors from "../colors/colors";

const styles = {
  label: {
    fontWeight: '700',
    fontSize: 16,
    color: '#444'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 8
  },
  button: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    color: 'white'
  },
  buttonDisabled: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#ccc',
    color: 'white'
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  icon: {
    color: '#333',
    marginRight: 20
  },
  p4: {
    padding: 4
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  }
}

export default styles;