import React from 'react'
import { Container, Grid, IconButton } from '@mui/material'
import styled from '@emotion/styled'

interface FavoriteComics {
  name: string
  thumbnailUri: string
}

interface FavoritesProps {
  favoritesComics: FavoriteComics[]
  onDeleteFavourite: (comic: any) => void
}

const ComicTitle = styled.div`
  font-weight: 700;
  width: 150px;
  font-size: 10px;
  text-align: center;
`

function Favorites (props: FavoritesProps) {
  const { favoritesComics, onDeleteFavourite } = props

  return (
    <div style={{ marginBottom: '64px' }}>
        {favoritesComics?.map((comic) => {
          return (
            <>
              <Container disableGutters sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}>
                  <IconButton
                    onClick={() => {
                      onDeleteFavourite(comic)
                    }}
                    sx={{ position: 'relative', height: '32px', width: '32px', top: '24px', left: '64px' }}
                  >
                    <img
                      src={require('../icons/btn-delete.png')}
                      alt={'icon of close'}
                    />
                  </IconButton>
                  <Grid direction={'row'}>
                    <img
                      src={comic.thumbnailUri}
                      alt={'Ilustration of the character'}
                      style={{ width: '150px', height: '200px' }}
                    />
                    <ComicTitle>{comic.name}</ComicTitle>
                    </Grid>
              </Container>
            </>
          )
        })}
    </div>
  )
}

export default Favorites
