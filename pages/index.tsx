import type { NextPage } from 'next'

import PocketBase from 'pocketbase'
import { useQuery } from 'react-query'


import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'


const Home: NextPage = () => {
  // const [books, setBooks] = useState<object>()
  const books = useQuery('books', async () => {
    const res = await fetch('http://192.168.11.2:8090/api/collections/books/records?expand=authors')
    console.log('response:', res)
    if(!res.ok) {
      throw new Error(res.status + ' - ' + res.statusText)
    }
    return res.json()
  })
  // console.log(books)

  // useEffect(() => {
  //   fetch('http://192.168.11.2:8090/api/collections/books/records?expand=authors')
  //     .then((res) => res.json())
  //     .then((data) => setBooks(data))
  // },[])
  if (books.isError) {
    return <p>Cant fetch books: {books?.error?.message}</p>
  }

  if (books.isLoading) {
    return <p>Loading ...</p>
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Bookist</title>
        <meta name="description" content="Bookist, your friendly book tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/dajabe/bookist">Bookist</a>
        </h1>

        <div className={styles.grid}>
          {books.data.items.map((item) => <a href={item.url} className={styles.card} key={item.id}>
            <h2>{item.title}</h2>
            <img src={item.cover} alt={item.title} height={200} />
            <ul>
            <li>Series: {item.series}</li>
            <li>Genre: {item.genre}</li>
            <li>Author: {item['@expand'].authors[0].name}</li>
            <li>Status: {item.status}</li>
            </ul>
          </a>)}
          
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
