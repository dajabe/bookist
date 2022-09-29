import Image from "next/image";
import React from "react";
import { useQuery, useMutation } from 'react-query'
import PocketBase from 'pocketbase'

const client = new PocketBase('http://192.168.11.2:8090/')

// pattern="[A-z0-9]{1,15} [A-z0-9]{1,15}"
export default function AddBook(): React.ReactElement {
  const mutation = useMutation((newBook: any) => {
    return client.records.create('books', newBook, { expand: 'authors' }) 
  })

  function handleSubmit(e: any) {
    e.preventDefault()
    const data = {
      title: e.target[1].value,
      status: e.target[2].value,
      authors: [e.target[0].value],
    }
    // console.log('handleClick: ', data)
    mutation.mutate(data)
  }

  const authors = useQuery('authors', async () => {
    const res = await fetch('http://192.168.11.2:8090/api/collections/authors/records')
    console.log('response:', res)
    if(!res.ok) {
      throw new Error(res.status + ' - ' + res.statusText)
    }
    return res.json()
  })

  
  if (authors.isError) {
    return <p>Cant fetch books: {authors?.error?.message}</p>
  }

  if (authors.isLoading) {
    return <p>Loading ...</p>
  }

  return (
    <>
    <h2>add book</h2>
    {/* <form action="/api/addBook" method="post"> */}
    <form onSubmit={handleSubmit} method="post">
      <label htmlFor="author">Author:</label>
      <select id="author" name="author" required > 
        {authors.data.items.map((author: any) => 
          <option value={author.id} key={author.id} >{author.name}</option>
        )}
      </select>

      <label htmlFor="title">Title:</label>
      <input type="title" id="title" name="title" required  />
      
      <label htmlFor="status">status:</label>
      <select id="status" name="status" required>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>

      <button>Submit</button>
    </form>
    </>
  );
}
