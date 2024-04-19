'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return(
    <div>
        <h1>Your item has been listed</h1>
        <Button variant="contained" onClick={() => router.replace("/")}>Back to Homepage</Button>
        <Link href="/dashboard"><Button variant="contained">Add another item</Button></Link>
    </div>
  );
}