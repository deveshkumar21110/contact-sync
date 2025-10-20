import React from 'react'
import {Container,Home} from "../index"

function FavoritesPage() {
  return (
    <Container className="min-h-screen bg-pink-100 md:bg-white">
      <Home showFavorites />
    </Container>
  );
}

export default FavoritesPage