/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import { Grid } from '@mui/material'
import { Md5 } from 'ts-md5'
import axios from 'axios'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const CloseButton = styled(IconButton)`
  position: relative;
  left: 95%;
  margin: 0;
  padding: 0;
  background: white;
`

interface ViewMoreProps {
  characterName: string
  description: string
  relatedComics: Array<{
    resourceURI: string
    name: string
  }>
  relatedStories: Array<{
    resourceURI: string
    name: string
  }>
  onClose: () => void
  open: boolean
}

interface marvelAuth {
  ts: number
  apikey: string
  hash: string | number[]
}

interface ComicData {
  description: string
  thumbnail: {
    path: string
    extension: string
  }
  title: string
}

export default function ViewMore (props: ViewMoreProps) {
  const {
    open,
    characterName,
    description,
    onClose,
    relatedComics,
    relatedStories
  } = props

  const [loading, setLoading] = React.useState<boolean>(true)
  const [isViewingComic, setIsViewingComic] = React.useState<boolean>(true)
  const [data, setData] = React.useState<ComicData>()
  const [actualItem, setActualItem] = React.useState<number>(0)
  const timeStamp = Date.now()
  const privateKey = 'bb453e3f31c6e03d1a5594ac3a39f3d49c69a633'
  const publicKey = 'd542be1a577e927d06ace6d3dcd5f02a'
  const hash = Md5.hashStr(timeStamp.toString() + privateKey + publicKey)

  const marvelAuthParams: marvelAuth = {
    ts: timeStamp,
    apikey: publicKey,
    hash
  }

  const getActualUrl = () => {
    if (isViewingComic) {
      return relatedComics.at(actualItem)?.resourceURI as string
    } else {
      return relatedStories.at(actualItem)?.resourceURI as string
    }
  }
  React.useEffect(() => {
    setLoading(true)
    axios
      .get(getActualUrl(), { params: marvelAuthParams })
      .then(
        (response: {
          status: number
          data: { data: { results: any[], total: number } }
        }) => {
          if (response.status === 200) {
            setData(response.data.data.results[0])
            setLoading(false)
          }
        }
      )
      .catch((err) => {
        console.log(err)
      })
  }, [open, actualItem, isViewingComic])

  const changeItemForward = () => {
    if (isViewingComic) {
      if (actualItem < relatedComics.length - 1) {
        setActualItem(actualItem + 1)
      } else {
        setActualItem(0)
      }
    } else {
      if (actualItem < relatedStories.length - 1) {
        setActualItem(actualItem + 1)
      } else {
        setActualItem(0)
      }
    }
  }

  const changeItemBackward = () => {
    if (isViewingComic) {
      if (actualItem < relatedComics.length && actualItem !== 0) {
        setActualItem(actualItem - 1)
      } else {
        setActualItem(relatedComics.length - 1)
      }
    } else {
      if (actualItem < relatedStories.length && actualItem !== 0) {
        setActualItem(actualItem - 1)
      } else {
        setActualItem(relatedStories.length - 1)
      }
    }
  }
  return (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={'md'}
        fullWidth={true}
        sx={{ backgroundColor: 'transparent', p: 0 }}
      >
        <>
          <DialogContent dividers >
            <CloseButton onClick={onClose} style={{ display: '' }}>
              <img
                src={require('../icons/btn-close.png')}
                alt={'icon of close modal'}
                width="70%"
                height="70%"
              />
            </CloseButton>
            <Grid container direction="column">
              <div
                style={{
                  margin: 0,
                  padding: '0 0 10px 0',
                  width: '100%',
                  fontSize: '22px',
                  fontWeight: '600'
                }}
              >
                {characterName}
              </div>
              <div
                style={{
                  margin: 0,
                  padding: '0 0 10px 0',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: '300'
                }}
              >
                {description}
              </div>
              <Grid container direction="row" justifyContent={'center'}>
                <Button
                  onClick={changeItemBackward}
                  sx={{
                    color: 'gray',
                    '&:hover': { color: 'black', background: 'none' }
                  }}
                >
                  <ArrowBackIosNewIcon />
                </Button>
                <img
                  src={`${data?.thumbnail?.path}.${data?.thumbnail?.extension}`}
                  alt={'Ilustration of the comic'}
                  width={'200'}
                  height={'300px'}
                  style={{ padding: '0px 16px 0px 16px' }}
                />
                <Button
                  onClick={changeItemForward}
                  sx={{
                    color: 'gray',
                    '&:hover': { color: 'black', background: 'none' }
                  }}
                >
                  <ArrowForwardIosIcon />
                </Button>
              </Grid>
              <div
                style={{
                  margin: '10px 0 0 0',
                  padding: 0,
                  width: '100%',
                  fontSize: '22px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {data?.title}
              </div>
            </Grid>
          </DialogContent>
          <Grid container direction="row" height="56px">
            <Button
              onClick={() => {
                setIsViewingComic(true)
                setActualItem(0)
              }}
              sx={{
                width: '50%',
                backgroundColor: isViewingComic ? '#3f3636' : '#efefef',
                '&:hover': {
                  backgroundColor: isViewingComic ? '#2c2525' : '#d7d7d7'
                },
                borderRadius: '0'
              }}
            >
              <AutoStoriesIcon
                sx={{
                  color: isViewingComic ? 'white' : 'red',
                  marginRight: '4px'
                }}
              />
              <div style={{ color: isViewingComic ? 'white' : 'red' }}>
                COMICS
              </div>
            </Button>
            <Button
              onClick={() => {
                setIsViewingComic(false)
                setActualItem(0)
              }}
              sx={{
                width: '50%',
                backgroundColor: isViewingComic ? '#efefef' : '#3f3636',
                '&:hover': {
                  backgroundColor: isViewingComic ? '#d7d7d7' : '#2c2525'
                },
                borderRadius: '0'
              }}
            >
              <RocketLaunchIcon
                sx={{
                  color: isViewingComic ? 'red' : 'white',
                  marginRight: '2px'
                }}
              />
              <div style={{ color: isViewingComic ? 'red' : 'white' }}>
                SERIES
              </div>
            </Button>
          </Grid>
        </>
      </Dialog>
    </div>
  )
}
