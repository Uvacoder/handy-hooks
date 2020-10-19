import React, { useState } from 'react'
import useComplexUserStore from '../hooks/useComplexStore'

export const PostDiv = ({ post }) => {
    return <div>
        <div>
            <h3>Title</h3>
            {post.title}
        </div>
        <div>
            <h3>Author name</h3>
            {post.user.name}
        </div>
    </div>
}

export default function ComplexUserStoreExample() {

    const { posts } = useComplexUserStore();
    const [isOpen, setisOpen] = useState(true)

    return (
        <div>
            <button onClick={() => setisOpen(!isOpen)}>Toggle</button>
            {isOpen && <>
                {posts.map(post => <PostDiv post={post} />)}
            </>
            }
        </div>
    )
}
