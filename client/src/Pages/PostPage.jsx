import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function PostPage() {
    const { postSlug } = useParams();

    useEffect(() => {
        console.log(postSlug)
    }, [postSlug]);
  return (
    <div>PostPage</div>
  )
}
