import React, { useContext, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { ActivityIndicator, Alert } from 'react-native';

import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

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
    const [isLoading, setIsLoading] = useState(false)
    const { signInWithGoogle } = useAuth();
    
    const theme = useTheme()

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true)
            return await signInWithGoogle()

        } catch(error) {
            console.log(error)
            Alert.alert('Não foi possivel conectar a conta Google')
            setIsLoading(false)
        }
            
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
                    <SignInSocialButton title="Entrar com o Google" svg={GoogleSvg} onPress={handleSignInWithGoogle}/>
                </FooterWrapper>

                {isLoading && <ActivityIndicator color={theme.colors.shape} style={{marginTop: 18}}/>}
            </Footer>
        </Container>
    );
}