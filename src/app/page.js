import Link from 'next/link'
import Shop from './(shop)/shop';
import styles from './page.module.css';

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className="font-poppins mx-auto hidden w-full justify-center md:flex pt-6 pb-6 text-xl ">
        <h1>Welcome to NUS Market Place!</h1>
      </div>
      <Shop />
    </main>
  );
}

export const revalidate = 0;
