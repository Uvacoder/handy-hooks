import * as React from 'react'
import FormValidationExample from "~/main/components/FormValidationExample";
import FetchRequestExample from "~/main/components/FetchRequestExample";
import LoginExample from './components/LoginExample';
import UserStoreExample from './components/UserStoreExample';
import { UserProvider } from './stores/UserStore';

export default function App() {


    return (
        <div>

            {/* <FormValidationExample />
            <FetchRequestExample />
        <LoginExample /> */}
            <UserProvider>
                <UserStoreExample />
            </UserProvider>

        </div>
    )
}
