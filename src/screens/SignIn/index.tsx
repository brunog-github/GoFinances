import React, { useContext } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { Alert } from 'react-native';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
    Container, 
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './style';

export function SignIn(){
    const { signInWithGoole } = useAuth();
    
    async function handleSignInWithGoole() {
        try {
            await signInWithGoole()

        } catch(error) {
            console.log(error)
            Alert.alert('Não foi possivel conectar a conta Google')
        };
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>Controle suas {'\n'} finanças de forma {'\n'} muito simples!</Title>

                    <SignInTitle>Faça seu login com {'\n'} uma das contas abaixo</SignInTitle>
                </TitleWrapper>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton title="Entrar com o Google" svg={GoogleSvg} onPress={signInWithGoole}/>
                    <SignInSocialButton title="Entrar com o Apple" svg={AppleSvg}/>
                </FooterWrapper>
            </Footer>
        </Container>
    );
}