import { createStore, createHook } from 'react-sweet-state';

const FetchUserFromUrl = async (id) => {
    const url = "https://jsonplaceholder.typicode.com/users/"

    const res = await fetch(url + id)
    if (res) {
        let user = await res.json()
        return user
    }
}

const setLocalStore = ({ getState, setState, user }) => {
    const localUserStore = { ...getState().userStore };

    localUserStore[user.id] = user

    // mutate state synchronously
    setState({
        userStore: localUserStore
    });
}

const Store = createStore({
    // value of the store on initialisation
    initialState: {
        userStore: {},
        posts: []
    },
    // actions that trigger store mutation
    actions: {
        getPosts: () => async ({ setState, getState }) => {
            const url = "https://jsonplaceholder.typicode.com/posts"
            const res = await fetch(url)
            let localPosts = await res.json()

            const userStore = getState().userStore;
            const newList = [] as any

            localPosts.forEach(async post => {
                if (post.userId in userStore) {
                    // Has cached version
                    newList.push({ ...post, user: userStore[post.userId] })

                } else {

                    // Fetch from url
                    const user = await FetchUserFromUrl(post.userId)
                    setLocalStore({ setState, getState, user })
                    newList.push({ ...post, user })

                }
            })

            setState({ posts: newList })

        }
    }
});

// or
export const useSweetState = createHook(Store);