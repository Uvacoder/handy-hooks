import React from 'react'

interface contextProps {
    users: any[];
}

const UserStateContext = React.createContext<contextProps>({ users: [] })
const UserDispatchContext = React.createContext<any>({})

function UserReducer(state, action) {
    switch (action.type) {
        case "addUser": {
            let localUsers = [...state.users]
            localUsers.push(action.value)

            const doesExist = state.users.filter(user => user.id == action.value.id)
            if (doesExist.length) {
                return { ...state }
            }

            return { ...state, users: localUsers }
        }

        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
function UserProvider({ children }) {
    const [state, dispatch] = React.useReducer(UserReducer, { users: [] })
    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    )
}
function useUserState() {
    const context = React.useContext(UserStateContext)
    if (context === undefined) {
        throw new Error('useUserState must be used within a UserProvider')
    }
    return context
}
function useUserDispatch() {
    const context = React.useContext(UserDispatchContext)
    if (context === undefined) {
        throw new Error('useUserDispatch must be used within a UserProvider')
    }
    return context
}
export { UserProvider, useUserState, useUserDispatch }