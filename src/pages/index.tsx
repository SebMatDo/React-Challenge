import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Md5 } from 'ts-md5'
import Character from './character'
import { Toolbar, Box, Grid, Pagination, Container } from '@mui/material'
import Header from '../components/header'
import FilterButton, { SortType } from './filterButton'
import ComicModal from './comic-modal'
import Favorites from './favorites'

interface marvelAuth {
  ts: number
  apikey: string
  hash: string | number[]
  limit: number
  offset: number
  orderBy?: string
  nameStartsWith?: string
}

function LandingPage (props: any) {
  const [data, setData] = React.useState<any[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [offset, setOffset] = useState<number>(0)
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined)
  const [nameStartsWith, setNameStartWith] = useState<string | undefined>(
    undefined
  )
  const [debouncedTerm, setDebouncedTerm] = useState(nameStartsWith)
  const [totalCharactersCount, setTotalCharactersCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [comicOpen, setComicOpen] = useState<boolean>(false)
  const [comicInformation, setComicInformation] = useState<{
    resourceURI: string
    name: string
  }>({ resourceURI: '', name: '' })
  const [comicFavourites, setComicFavourites] = useState<
  Array<{ name: string, thumbnailUri: string }>
  >([])
  const [isComicFavourite, setIsComicFavourite] = useState<boolean>(false)

  const timeStamp = Date.now()
  const privateKey = 'bb453e3f31c6e03d1a5594ac3a39f3d49c69a633'
  const publicKey = 'd542be1a577e927d06ace6d3dcd5f02a'
  const hash = Md5.hashStr(timeStamp.toString() + privateKey + publicKey)

  const marvelAuthParams: marvelAuth = {
    ts: timeStamp,
    apikey: publicKey,
    hash,
    limit: 10,
    offset,
    orderBy,
    nameStartsWith
  }
  const client = axios.create({
    baseURL: 'https://gateway.marvel.com:443/v1/public/'
  })

  React.useEffect(() => {
    if (isLoading) {
      client
        .get('/characters', { params: marvelAuthParams })
        .then(
          (response: {
            status: number
            data: { data: { results: any[], total: number } }
          }) => {
            if (response.status === 200) {
              setData(response.data.data.results)
              setTotalCharactersCount(response.data.data.total)
              setIsLoading(false)
            }
          }
        )
        .catch((err) => {
          console.log(err)
        })
    }
  }, [isLoading])

  // update 'term' value after .8 second from the last update of 'debouncedTerm'
  useEffect(() => {
    const timer = setTimeout(() => {
      setNameStartWith(debouncedTerm)
    }, 800)
    return () => {
      clearTimeout(timer)
    }
  }, [debouncedTerm])

  // submit a new search
  useEffect(() => {
    if (nameStartsWith !== '') {
      setIsLoading(true)
      setOffset(0)
      setPage(0)
    } else {
      setNameStartWith(undefined)
      setOffset(0)
      setPage(0)
    }
  }, [nameStartsWith])

  const changePagination = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPage(page)
    setOffset(10 * page - 10)
    setIsLoading(true)
  }

  const onSearchChange = (event: any) => {
    setDebouncedTerm(event.target.value)
  }

  const clickedComic = (comicInformation: any) => {
    setComicOpen(true)
    setComicInformation(comicInformation)
    const isFavourite = comicFavourites.some(
      (comic) => comic.name === comicInformation.name
    )
    setIsComicFavourite(isFavourite)
  }

  const onCloseComic = () => {
    setComicOpen(false)
  }

  const addedFavourites = (comic: any) => {
    const newFavourites = [...comicFavourites]
    newFavourites.push(comic)
    setComicFavourites(newFavourites)
    setIsComicFavourite(true)
    // To do, si ya está añadido no anadirlo de nuevo
  }
  const onDeleteFavourite = (comic: any) => {
    const filteredArray = comicFavourites.filter(
      (item) => item.name !== comic.name
    )
    setComicFavourites(filteredArray)

    setIsComicFavourite(false)
  }

  const setFilter = (sortType: SortType) => {
    switch (sortType) {
      case SortType.DateAscending:
        setOrderBy('modified')
        setIsLoading(true)
        break
      case SortType.NameAscending:
        setOrderBy('name')
        setIsLoading(true)
        break
      case SortType.NameDescending:
        setOrderBy('-name')
        setIsLoading(true)
        break
      case SortType.DateDescending:
        setOrderBy('-modified')
        setIsLoading(true)
        break
      default:
        setOrderBy(undefined)
        setIsLoading(true)
    }
  }

  return (
    <>
      <Header onSearchChange={onSearchChange} />
      <Box component="main" sx={{ p: 5, padding: '0' }}>
        <Toolbar />
        <Box sx={{ flexGrow: 1, backgroundColor: '#f3f3f3' }}>
          <Grid container direction="row">
            <Grid
              item
              xs={10}
              sx={{ backgroundColor: '#f3f3f3', padding: '30px' }}
            >
              <Grid container direction="row">
                <Container
                  disableGutters
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '32px'
                  }}
                >
                  <img
                    src={require('../icons/characters.png')}
                    alt={'icon of characters'}
                    width={'40px'}
                    height={'40px'}
                  />
                  <div
                    style={{
                      margin: '0px 480px 0px 0px',
                      fontSize: '22px',
                      fontWeight: '800'
                    }}
                  >
                    Characters
                  </div>

                  <FilterButton setFilter={setFilter} />
                </Container>
              </Grid>
              {!isLoading && (
                <Container
                  disableGutters
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  {data?.map((characterInfo) => {
                    return (
                      <Character
                        key={characterInfo.id}
                        characterName={characterInfo.name}
                        description={characterInfo.description}
                        thumbnail={characterInfo.thumbnail}
                        relatedComics={characterInfo.comics.items}
                        relatedStories={characterInfo.series.items}
                        clickedComic={clickedComic}
                      />
                    )
                  })}
                </Container>
              )}
            </Grid>
            <Container
              disableGutters
              sx={{
                backgroundColor: '#eaeaea',
                padding: '16px',
                position: 'fixed',
                top: 'inherit',
                right: '0',
                height: '100%',
                overflow: 'auto',
                width: '230px'
              }}
            >
              <Container
                disableGutters
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img
                  src={require('../icons/favourites.png')}
                  alt={'icon of characters'}
                  width={'32px'}
                  height={'32px'}
                />
                <div
                  style={{
                    margin: '0px 0px 0px 8px',
                    fontSize: '22px',
                    fontWeight: '800'
                  }}
                >
                  My favourites
                </div>
              </Container>
              <Favorites
                favoritesComics={comicFavourites}
                onDeleteFavourite={onDeleteFavourite}
              />
            </Container>
          </Grid>
        </Box>
      </Box>
      <div style={{ width: '100%', placeContent: 'center', display: 'flex' }}>
        <Pagination
          count={Math.ceil(totalCharactersCount / 10)}
          size="large"
          onChange={changePagination}
          page={page}
        />
      </div>
      <ComicModal
        open={comicOpen}
        onClose={onCloseComic}
        comicInformation={comicInformation}
        onAddedFavourites={addedFavourites}
        onDeleteFavourite={onDeleteFavourite}
        isOnFavourite={isComicFavourite}
      />
    </>
  )
}

export default LandingPage
