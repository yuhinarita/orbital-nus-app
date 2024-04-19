'use client'
import './globals.css'
import { AuthContextProvider } from '../context/AuthContext'
import NavBar from './(navbar)/navbar';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
// import 'tailwindcss/tailwind.css';

export default function RootLayout({ children }) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <AuthContextProvider>
          <NavBar />
          <Box 
          sx={{
            backgroundColor:'#ececec',
            borderRadius: 0,
            border: '1px solid #d3d3d3'
          }}
          >
            <div className = "mx-auto hidden w-full justify-center md:flex pt-2 text-xl ">
  
            </div>
            <form
              onSubmit = {submitHandler}
              className="mx-auto hidden w-full justify-center md:flex "
            >
              <input
                onChange = {(e) => setQuery(e.target.value)}
                type="search"
                className="rounded-tr-none rounded-br-none p-2 text-sm focus:ring-0"
                placeholder="search products"
              />

              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
            <div className = "pb-2">

            </div>
          </Box>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}