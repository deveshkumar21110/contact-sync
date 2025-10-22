import React from 'react'
import {Container,Home} from "../index"

function TrashPage() {
  return (
    <Container className="min-h-screen bg-pink-100 md:bg-white">
      <Home trash={true} />
    </Container>
  );
}

export default TrashPage