import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import Icons from './Icons';
import { useMemo } from 'react';
import type { CreditCardIssuer } from './useCreditCardForm';

const CARD_SIZE = { width: 300, height: 190 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {
    backgroundColor: '#444',
    borderRadius: 10,
  },
  cardMagneticStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 30,
    height: 40,
    backgroundColor: '#000',
  },
  icon: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  baseText: {
    color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  focusedField: {
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  number: {
    fontSize: 21,
    position: 'absolute',
    top: 95,
    left: 28,
  },
  name: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 100,
  },
  expiryLabel: {
    fontSize: 9,
    position: 'absolute',
    bottom: 40,
    left: 218,
  },
  expiry: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: 'absolute',
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: 'absolute',
    top: 80,
    right: 30,
  },
});

interface Props {
  focusedField?: 'name' | 'number' | 'expiry' | 'cvc';
  type?: CreditCardIssuer;
  name?: string;
  number?: string;
  expiry?: string;
  cvc?: string;
  monthYearLabel?: string;

  placeholders?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  style?: ViewStyle;
  cardStyle?: StyleProp<ViewStyle>;
  textsStyle?: StyleProp<TextStyle>;
  focusedTextsStyle?: StyleProp<TextStyle>;
  cvcReplaceChar?: string;

  fontFamily?: string;
  imageFront?: ImageSourcePropType;
  imageBack?: ImageSourcePropType;
}

const CreditCardView = (props: Props) => {
  const {
    focusedField,
    type,
    name,
    number,
    expiry,
    cvc,
    monthYearLabel,
    placeholders = {
      number: '•••• •••• •••• ••••',
      name: '',
      expiry: '••/••',
      cvc: '•••',
    },
    imageFront,
    imageBack,
    fontFamily = Platform.select({
      ios: 'Courier',
      android: 'monospace',
      web: 'monospace',
    }),
    style,
    cardStyle,
    textsStyle,
    focusedTextsStyle,
    cvcReplaceChar = '•',
  } = props;

  const isAmex = type === 'american-express';
  const shouldShowCardBack = !isAmex && focusedField === 'cvc';

  const cardIcon = useMemo(() => {
    if (type && Icons[type]) return Icons[type];
    return null;
  }, [type]);

  const cvcText = useMemo(() => {
    if (!cvc) {
      return placeholders.cvc;
    }
    if (cvcReplaceChar) {
      return cvcReplaceChar.repeat(cvc.length);
    }
    return cvc;
  }, [cvc, cvcReplaceChar, placeholders.cvc]);

  return (
    <View style={[s.cardContainer, CARD_SIZE, style]}>
      <FlipCard
        flipHorizontal
        flipVertical={false}
        friction={10}
        perspective={2000}
        clickable={false}
        flip={shouldShowCardBack}
      >
        <ImageBackground
          style={[CARD_SIZE, s.cardFace, cardStyle]}
          source={imageFront}
        >
          {!!cardIcon && (
            <Image
              style={[s.icon]}
              source={{ uri: cardIcon }}
            />
          )}

          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.number,
              !number && s.placeholder,
              textsStyle,
              focusedField === 'number' && s.focusedField,
              focusedField === 'number' && focusedTextsStyle,
            ]}
          >
            {!number ? placeholders.number : number}
          </Text>

          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.name,
              !name && s.placeholder,
              textsStyle,
              focusedField === 'name' && s.focusedField,
              focusedField === 'name' && focusedTextsStyle,
            ]}
            numberOfLines={1}
          >
            {!name ? placeholders.name : name.toUpperCase()}
          </Text>

          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.expiryLabel,
              s.placeholder,
              textsStyle,
              focusedField === 'expiry' && s.focusedField,
              focusedField === 'expiry' && focusedTextsStyle,
            ]}
          >
            {monthYearLabel || 'MONTH/YEAR'}
          </Text>
          <Text
            style={[
              s.baseText,
              { fontFamily },
              s.expiry,
              !expiry && s.placeholder,
              textsStyle,
              focusedField === 'expiry' && s.focusedField,
              focusedField === 'expiry' && focusedTextsStyle,
            ]}
          >
            {!expiry ? placeholders.expiry : expiry}
          </Text>

          {isAmex && (
            <Text
              style={[
                s.baseText,
                { fontFamily },
                s.amexCVC,
                !cvc && s.placeholder,
                textsStyle,
                focusedField === 'cvc' && s.focusedField,
                focusedField === 'cvc' && focusedTextsStyle,
              ]}
            >
              {cvcText}
            </Text>
          )}
        </ImageBackground>

        <ImageBackground
          style={[CARD_SIZE, s.cardFace, cardStyle]}
          source={imageBack}
        >
          <View style={s.cardMagneticStripe} />
          <Text
            style={[
              s.baseText,
              s.cvc,
              !cvc && s.placeholder,
              textsStyle,
              focusedField === 'cvc' && s.focusedField,
              focusedField === 'cvc' && focusedTextsStyle,
            ]}
          >
            {cvcText}
          </Text>
        </ImageBackground>
      </FlipCard>
    </View>
  );
};

export default CreditCardView;
