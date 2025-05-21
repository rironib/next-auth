'use client';
import {signOut, useSession} from 'next-auth/react';
import {Spinner} from "@heroui/react";

export default function DashboardPage() {
    const {data: session, status} = useSession();

    if (status === 'loading') return <Spinner />;
    if (!session) return <p>Access Denied</p>;

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Welcome, {session.user.name}</p>
            <button onClick={() => signOut()}>Sign Out</button>
        </main>
    );
}
