import React, { createContext, ReactNode, useContext } from 'react';

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string
    name: string
    email: string
    photo?: string
}

interface AuthContextData {
    user: User
    signInWithGoole(): Promise<void> 
}

const AuthContext = createContext({} as AuthContextData); 

function AuthProvider({ children } : AuthProviderProps) {
    const user = {
        id: "aiwhed289123jas2y372ji",
        name: "Bruno",
        email: "bruno.g.p31@hotmail.com"
    }

    async function signInWithGoole() {
        try {
            const CLIENT_ID = "896896238542-iqoqlnv63jodts2a53c907f9pb1v7vc6" //.apps.googleusercontent.com
            const REDIRECT_URI = "https://auth.expo.io/@bruno96/gofinances"
            const RESPONSE_TYPE = "token"
            const SCOPE = encodeURI("profile email")

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

            const response = await AuthSession.startAsync({ authUrl })
            console.log(response)

        }catch(error){
            throw new Error(error)
        }
    }

    return (
        <AuthContext.Provider value={{
            user: user,
            signInWithGoole
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }