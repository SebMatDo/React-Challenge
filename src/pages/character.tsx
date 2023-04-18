import React from 'react'
import styled from '@emotion/styled'
import { Box, Button, Grid, Link } from '@mui/material'
import ViewMore from './view-more-page'

const DescriptionContainer = styled.div`
  font-weight: 100;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  width: 100%;
  font-size: 14px;
  padding: 8px 0px 0px 0px;
`
const CharacterNameContainer = styled.div`
  font-weight: 1000;
  padding: 0;
  width: 100%;
  font-size: 20px;
`
const RelateComicContainer = styled.div`
  font-weight: 800;
  overflow: hidden;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  margin: 0px 0px 8px 16px;
  padding: 0;
  width: 100%;
`
const RelatedComicItemContainer = styled(Link)`
  font-weight: 200;
  width: 40%;
  margin: 8px 16px 0px 16px;
  font-size: 12px;
  color: black;
  &:hover {
    color: #db1515;
  }
`
const ButtonViewMore = styled(Button)`
  padding: 8px 16px 8px 16px;
  margin: 0px 0px 0px 180px;
  position: relative;
  bottom: 8px;
`

export interface CharacterInformation {
  characterName: string
  description: string
  thumbnail: {
    path: string
    extension: string
  }
  relatedComics: Array<{
    resourceURI: string
    name: string
  }>
  relatedStories: Array<{
    resourceURI: string
    name: string
  }>
  clickedComic: (comicInformation: any) => void
}

function Character (props: CharacterInformation) {
  const {
    characterName,
    description,
    thumbnail,
    relatedComics,
    relatedStories,
    clickedComic
  } = props
  const [viewMoreOpen, setViewMoreOpen] = React.useState<boolean>(false)
  return (
    <>
      <Grid
        container
        direction="column"
        width={'430px'}
        height={'320px'}
        m={'0 24px 48px 24px'}
      >
        <div style={{ background: 'white', height: '100%' }}>
          <Grid container direction="row">
            <Box
              height={'150px'}
              width={'150px'}
              sx={{ position: 'relative', bottom: '16px', right: '16px' }}
            >
              <img
                src={thumbnail.path + '.' + thumbnail.extension}
                alt={'Ilustration of the character'}
                style={{
                  borderRadius: '50%',
                  objectFit: 'fill',
                  height: '150px',
                  width: '150px'
                }}
              />
            </Box>
            <Box
              height={'150px'}
              width={'270px'}
              sx={{ position: 'relative', bottom: '16px' }}
            >
              <CharacterNameContainer> {characterName} </CharacterNameContainer>
              <DescriptionContainer> {description} </DescriptionContainer>
            </Box>
            <ButtonViewMore
              variant="contained"
              size="large"
              color="error"
              onClick={() => {
                setViewMoreOpen(true)
              }}
            >
              VIEW MORE
            </ButtonViewMore>
          </Grid>
          <Grid container direction="row">
            <RelateComicContainer>Related Comics</RelateComicContainer>
            {relatedComics?.map((item, index) => {
              if (index < 4) {
                return (
                  <RelatedComicItemContainer
                    key={item.name}
                    underline="none"
                    onClick={() => {
                      clickedComic(item)
                    }}
                    href="#"
                  >
                    {item.name}
                  </RelatedComicItemContainer>
                )
              }
              return <></>
            })}
          </Grid>
        </div>
      </Grid>
      <ViewMore
        open={viewMoreOpen}
        onClose={() => {
          setViewMoreOpen(false)
        }}
        characterName={characterName}
        description={description}
        relatedComics={relatedComics}
        relatedStories={relatedStories}
        key={characterName}
      />
    </>
  )
}

export default Character
