import PocketBase from 'pocketbase'

const client = new PocketBase('http://192.168.11.2:8090/')

export default async function handler(req, res) {
  // Get data submitted in request's body.
  const body = req.body

  // Optional logging to see the responses
  // in the command line where next.js app is running.
  console.log('body: ', body)

  // Guard clause checks for first and last name,
  // and returns early if they are not found
  if (!body.author || !body.title || !body.status) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'Book author or title not found' })
  }

  const data = {
    title: body.title,
    status: body.status,
    authors: [body.author],
  }

  try {
    await client.records.create('books', data, { expand: 'authors' })
  } catch (e) {
    console.log(e)
  }
  // Found the name.
  // Sends a HTTP success code
  // res.status(200).json({ data: `${body.author} ${body.title} ${body.status}` })
  res.status(200).json(req.body)
}
