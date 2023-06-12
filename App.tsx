import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Formik} from 'formik';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be minimum of 4 characters')
    .max(16, 'Should be maximum of 16 characters')
    .required('Length is required'),
});

export default function App() {
  let initialPasswordData = {
    password: '',
    isPasswordGenerated: false,
    lowerCase: true,
    upperCase: false,
    numbers: false,
    symbols: false,
  };
  const [passwordData, setPasswordData] = useState(initialPasswordData);

  const handlePasswordData = (name: string, value: any) => {
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const genratePasswordString = (passwordLength: number) => {
    let characterList = '';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+';
    if (passwordData.upperCase) {
      characterList += upperCaseChars;
    }
    if (passwordData.lowerCase) {
      characterList += lowerCaseChars;
    }
    if (passwordData.numbers) {
      characterList += digitChars;
    }
    if (passwordData.symbols) {
      characterList += specialChars;
    }
    const passwordResult = createPassword(characterList, passwordLength);
    setPasswordData(prev => ({
      ...prev,
      password: passwordResult,
      isPasswordGenerated: true,
    }));
  };

  const resetPasswordData = () => {
    setPasswordData(initialPasswordData);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContaiiner}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{passwordLength: ''}}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              console.log(values);
              genratePasswordString(+values.passwordLength);
            }}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.label}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorMsg}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex. 8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Include Lowercase letters</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={passwordData.lowerCase}
                    onPress={() =>
                      handlePasswordData('lowerCase', !passwordData.lowerCase)
                    }
                    fillColor="#29AB87"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Include Uppercase letters</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={passwordData.upperCase}
                    onPress={() =>
                      handlePasswordData('upperCase', !passwordData.upperCase)
                    }
                    fillColor="#FED85D"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Include Numbers</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={passwordData.numbers}
                    onPress={() =>
                      handlePasswordData('numbers', !passwordData.numbers)
                    }
                    fillColor="#C9A0DC"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Include Symbols</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={passwordData.symbols}
                    onPress={() =>
                      handlePasswordData('symbols', !passwordData.symbols)
                    }
                    fillColor="#FC80A5"
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSubmit}
                    disabled={!isValid}>
                    <Text style={styles.primaryTxt}>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordData();
                    }}
                    disabled={!isValid}>
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        {passwordData.isPasswordGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <View style={styles.cardTextWrap}>
              <Text style={styles.subTitle}>Password</Text>
            </View>
            <Text selectable style={styles.generatedPassword}>
              {passwordData.password}
            </Text>
            <View style={styles.cardTextWrap}>
              <Text style={styles.description}>Long Press to copy</Text>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    height: 720,
    backgroundColor: '#000',
  },
  formContaiiner: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 30,
    marginLeft: 15,
    color: '#fca311',
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    color: '#FFF',
    borderColor: '#48cae4',
  },
  label: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },
  errorMsg: {
    fontSize: 12,
    color: '#ff0d10',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#48cae4',
  },
  primaryTxt: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: 120,
    padding: 18,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#d3eff5',
    borderWidth: 2,
    borderColor: '#48cae4',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 6,
    marginTop: 35,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#57cc99',
    elevation: 3,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#424747',
    marginBottom: 8,
    marginTop: 25,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 15,
    color: '#000',
  },
  cardTextWrap: {justifyContent: 'center', alignItems: 'center'},
});
