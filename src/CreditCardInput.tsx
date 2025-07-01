import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  useCreditCardForm,
  type CreditCardFormData,
  type CreditCardFormField,
} from './useCreditCardForm';

interface Props {
  autoFocus?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  placeholderColor?: string;
  labels?: {
    number: string;
    expiry: string;
    cvc: string;
    name?: string;
  };
  placeholders?: {
    number: string;
    expiry: string;
    cvc: string;
    name?: string;
  };
  formData?: CreditCardFormData;
  onChange: (formData: CreditCardFormData) => void;
  focusedField?: CreditCardFormField;
  onFocusField?: (field: CreditCardFormField) => void;
  testID?: string;
  errorMessages?: {
    number?: {
      invalid?: string;
      incomplete?: string;
    };
    expiry?: {
      invalid?: string;
      incomplete?: string;
    };
    cvc?: {
      invalid?: string;
      incomplete?: string;
    };
    name?: string;
  };
  requiresName?: boolean;
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: 'contain',
  },
  numberInput: {},
  extraContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  expiryInputContainer: {
    flex: 1,
    marginRight: 5,
  },
  cvcInputContainer: {
    flex: 1,
    marginLeft: 5,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomColor: 'darkgray',
    borderBottomWidth: 1,
    // outlineWidth is used to hide the text-input outline on react-native-web
    outlineWidth: 0,
  },
  nameInput: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  invalidInput: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

const CreditCardInput = (props: Props) => {
  const {
    autoFocus,
    style,
    labelStyle,
    inputStyle,
    placeholderColor = 'darkgray',
    labels = {
      number: 'CARD NUMBER',
      expiry: 'EXPIRY',
      cvc: 'CVC/CVV',
      name: 'CARDHOLDER NAME',
    },
    placeholders = {
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC',
      name: 'JOHN DOE',
    },
    formData,
    onChange = () => {},
    focusedField,
    onFocusField = () => {},
    testID,
    errorMessages = {},
    requiresName = false,
  } = props;

  const { values, onChangeValue } = useCreditCardForm(onChange, requiresName);

  const nameInput = useRef<TextInput>(null);
  const numberInput = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      requiresName ? nameInput.current?.focus() : numberInput.current?.focus();
    }
  }, [autoFocus, requiresName]);

  const handleInputStyle = (field: CreditCardFormField) => {
    return [
      s.input,
      inputStyle,
      formData?.status[field] === 'invalid' ||
      (formData?.status[field] === 'incomplete' &&
        focusedField !== field &&
        formData?.values[field])
        ? s.invalidInput
        : null,
    ];
  };

  const handleInputErrorText = (field: CreditCardFormField) => {
    if (formData?.status[field] && errorMessages[field]) {
      return (
        <Text style={s.errorText}>
          {formData?.status[field] === 'invalid'
            ? typeof errorMessages[field] !== 'string' &&
              errorMessages[field]?.invalid
            : formData?.status[field] === 'incomplete' &&
                focusedField !== field &&
                formData?.values[field]
              ? typeof errorMessages[field] !== 'string' &&
                errorMessages[field]?.incomplete
              : null}
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      style={[s.container, style]}
      testID={testID}
    >
      {requiresName && (
        <View style={[s.nameInput]}>
          <Text style={[s.inputLabel, labelStyle]}>{labels.name}</Text>
          <TextInput
            ref={nameInput}
            style={handleInputStyle('name')}
            placeholderTextColor={placeholderColor}
            placeholder={placeholders.name}
            value={values.name}
            onChangeText={(v) => onChangeValue('name', v)}
            onFocus={() => onFocusField('name')}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            testID="CC_NAME"
          />
          {formData?.status.name === 'invalid' && errorMessages.name && (
            <Text style={s.errorText}>{errorMessages.name}</Text>
          )}
        </View>
      )}

      <View style={[s.numberInput]}>
        <Text style={[s.inputLabel, labelStyle]}>{labels.number}</Text>
        <TextInput
          ref={numberInput}
          keyboardType="numeric"
          style={handleInputStyle('number')}
          placeholderTextColor={placeholderColor}
          placeholder={placeholders.number}
          value={values.number}
          onChangeText={(v) => onChangeValue('number', v)}
          onFocus={() => onFocusField('number')}
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          testID="CC_NUMBER"
          textContentType="creditCardNumber"
          autoComplete="cc-number"
        />
        {handleInputErrorText('number')}
      </View>

      <View style={[s.extraContainer]}>
        <View style={s.expiryInputContainer}>
          <Text style={[s.inputLabel, labelStyle]}>{labels.expiry}</Text>
          <TextInput
            keyboardType="numeric"
            style={handleInputStyle('expiry')}
            placeholderTextColor={placeholderColor}
            placeholder={placeholders.expiry}
            value={values.expiry}
            onChangeText={(v) => onChangeValue('expiry', v)}
            onFocus={() => onFocusField('expiry')}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            testID="CC_EXPIRY"
          />
          {handleInputErrorText('expiry')}
        </View>

        <View style={s.cvcInputContainer}>
          <Text style={[s.inputLabel, labelStyle]}>{labels.cvc}</Text>
          <TextInput
            keyboardType="numeric"
            textContentType="password"
            secureTextEntry={true}
            style={handleInputStyle('cvc')}
            placeholderTextColor={placeholderColor}
            placeholder={placeholders.cvc}
            value={values.cvc}
            onChangeText={(v) => onChangeValue('cvc', v)}
            onFocus={() => onFocusField('cvc')}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            testID="CC_CVC"
          />
          {handleInputErrorText('cvc')}
        </View>
      </View>
    </View>
  );
};

export default CreditCardInput;
