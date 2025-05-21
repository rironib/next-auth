import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/nextAuth';

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user || null;
}
