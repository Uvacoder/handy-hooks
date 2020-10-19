import React, { useEffect, useState } from "react";
import { useUserState, useUserDispatch } from "../stores/UserStore";

// Does an initial call to get 100 posts
// Then does 100 subsequent calls to get users even if the ids are the same, how do we fix this?
// Each re-render from here on uses the cached however

function useComplexUserStore() {
    const [posts, setposts] = useState([])


    const { users } = useUserState()
    const dispatch = useUserDispatch()

    const FetchUserFromUrl = async (dispatch, id) => {
        const url = "https://jsonplaceholder.typicode.com/users/"

        const res = await fetch(url + id)
        if (res) {
            let user = await res.json()
            dispatch({ type: "addUser", value: user })
            return user
        }
    }

    const getPosts = async () => {
        const url = "https://jsonplaceholder.typicode.com/posts"
        const res = await fetch(url)
        let localPosts = await res.json()

        const newList = [] as any
        localPosts.forEach(async post => {
            const hasUser = users.filter(user => user.id == post.userId)
            if (hasUser.length) {
                // Has cached version
                newList.push({ ...post, user: hasUser[0] })

            } else {
                // Fetch from url
                const user = await FetchUserFromUrl(dispatch, post.userId)
                newList.push({ ...post, user })
            }
        })

        setposts(newList)
    }

    useEffect(() => {
        getPosts()
    }, [])

    return { posts }

}

export default useComplexUserStore