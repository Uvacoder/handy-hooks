import React from "react";
import { useUserDispatch, useUserState } from "../stores/UserStore";

function useUserStore(id) {
    const [userObject, setuserObject] = React.useState<any>([])
    const { users } = useUserState()
    const dispatch = useUserDispatch()

    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<any>(null)

    const url = "https://jsonplaceholder.typicode.com/users/"

    const FindUserInStore = () => {
        console.log(users, 'users in store')
        return users.filter(user => user.id == id)
    }

    const FetchUserFromUrl = async (dispatch) => {
        const res = await fetch(url + id)
        if (res) {
            let user = await res.json()
            setuserObject(user)
            dispatch({ type: "addUser", value: user })
        }
    }

    React.useEffect(() => {
        setIsLoading(true);
        const hasUserInStore = FindUserInStore()
        if (hasUserInStore.length) {
            console.log("Using cached user")
            setuserObject(hasUserInStore[0])
        } else {
            FetchUserFromUrl(dispatch)
        }
        setIsLoading(false)

    }, [id])

    return { userObject, isLoading, error }
}
export default useUserStore;
