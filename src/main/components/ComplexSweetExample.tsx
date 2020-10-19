import React, { useEffect, useState } from 'react'
import { useSweetState } from '../hooks/useSweetState';
import { PostDiv } from './ComplexUserStoreExample';

export default function ComplexSweetExample() {
    const [state, actions] = useSweetState();
    const [isOpen, setisOpen] = useState(true)

    const getPosts = async () => {
        actions.getPosts()
    }

    useEffect(() => {
        getPosts()
    }, [])

    useEffect(() => {
        if (isOpen) {

            getPosts()
        }
    }, [isOpen])

    return (
        <div>
            <button onClick={() => setisOpen(!isOpen)}>Toggle</button>
            {isOpen && <>
                {state.posts.map(post => <PostDiv post={post} />)}
            </>
            }
        </div>
    )
}
