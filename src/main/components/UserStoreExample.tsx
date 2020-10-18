import React, { useState } from 'react'
import useUserStore from '../hooks/useUserStore'
import { useUserState } from '../stores/UserStore'
import Delay from './Delay'

const RenderUser = (props) => {
    const { userObject } = useUserStore(props.id)
    return <>
        {userObject.name}
    </>

}

const RenderListDelayed = (props) => {
    const { userObject } = useUserStore(props.id)
    return <Delay
        waitBeforeShow={1000}
    >
        <div>        {userObject.name}
        </div>
    </Delay>
}

export default function UserStoreExample() {
    const userid_list = [1, 2, 3, 4, 1]

    const [showUsers, setshowUsers] = useState(false)
    const { users } = useUserState()


    return (
        <div>
            {/* This call doesn't use cached users even if there is an id double up */}
            {userid_list.map((userid, idx) => {
                return <RenderUser id={userid} key={idx} />
            })}

            {/* This call doesn't use cached users even if there is an id double up and delay because the hook runs on render*/}

            {userid_list.map((userid, idx) => {
                return <RenderListDelayed id={userid} key={idx} />
            })}

            {/* This call does use the cached users as the hook doesnt run until the delay renders the subcomponent */}
            <Delay
                waitBeforeShow={1000}
            >
                <div>

                    {userid_list.map((userid, idx) => {
                        return <RenderListDelayed id={userid} key={idx} />
                    })}
                </div>
            </Delay>

            {/* This call does use the cached users as the hook doesnt run until the button/hook renders the subcomponent */}

            <button onClick={() => setshowUsers(!showUsers)}>Show users</button>
            {showUsers && <div>
                Show users new
                {userid_list.map((userid, idx) => {
                return <RenderUser id={userid} key={idx + 'new'} />
            })}
            </div>}

            {/* Showing whats in the store */}
            {users.map((user, idx) => {
                return <div key={idx}>{user.name} in store </div>
            })}
        </div>
    )
}
