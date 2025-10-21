import React from 'react'
import { Container,Home } from '..'
import { useParams } from 'react-router-dom'

function LabelFilterPage() {
    const { id } = useParams();
    console.log(id);
  return (
    <Container className="min-h-screen bg-pink-100 md:bg-white">
      <Home filterLabel={id} />
    </Container>
  )
}

export default LabelFilterPage