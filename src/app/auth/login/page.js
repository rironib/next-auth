'use client';

import {signIn} from 'next-auth/react';
import {useSearchParams} from 'next/navigation';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || 'dashboard';
    const error = searchParams.get('error');

    const handleLogin = () => {
        signIn('github', {callbackUrl});
    };

    return (
        <main>
            <h1>Login</h1>
            {error && <p style={{color: 'red'}}>Login failed. Try again.</p>}
            <button onClick={handleLogin}>Sign in with GitHub</button>
        </main>
    );
}
