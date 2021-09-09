import React, { createContext, ReactNode, useContext } from 'react';

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
}

const AuthContext = createContext({} as AuthContextData); 

function AuthProvider({ children } : AuthProviderProps) {
    const user = {
        id: "aiwhed289123jas2y372ji",
        name: "Bruno",
        email: "bruno.g.p31@hotmail.com"
    }

    return (
        <AuthContext.Provider value={{
            user: user
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