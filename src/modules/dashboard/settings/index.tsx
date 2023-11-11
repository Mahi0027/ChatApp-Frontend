import { dashboardContext } from '@/src/context';
import React, { useContext } from 'react'
import Profile from './Profile';
import General from './General';

const Index = () => {

    const { settingPage } = useContext(dashboardContext);
    return (
        <>
            <div className="h-full w-full md:w-4/5 lg:w-3/5 flex flex-col justify-center items-center text-center text-lg font-semibold px-5">
                {settingPage.profile && <Profile />}
                {settingPage.general && <General />}
                {settingPage.chats && (
                    <>
                        <p>This is chats setting page</p>
                    </>
                )}
                {settingPage.help && (
                    <>
                        <p>This is help setting page</p>
                    </>
                )}
                {settingPage.logout && (
                    <>
                        <p>This is logout setting page</p>
                    </>
                )}
            </div>
        </>
    );
};

export default Index