import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'
import axios from 'axios'
import { Md5 } from 'ts-md5'

const CloseButton = styled(IconButton)`
  position: relative;
  left: 95%;
  margin: 0;
  padding: 0;
  background: white;
`

interface ComicModalProps {
  comicInformation: {
    resourceURI: string
    name: string
  }
  onClose: () => void
  open: boolean
  onAddedFavourites: (comic: { thumbnailUri: string, name: string }) => void
  isOnFavourite: boolean
  onDeleteFavourite: (comic: any) => void
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
}

export default function ComicModal (props: ComicModalProps) {
  const {
    open,
    comicInformation,
    onClose,
    onAddedFavourites,
    isOnFavourite,
    onDeleteFavourite
  } = props
  const [data, setData] = React.useState<ComicData>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [price, setPrice] = React.useState<number>(0)
  const client = axios.create({
    baseURL: comicInformation.resourceURI
  })

  const timeStamp = Date.now()
  const privateKey = 'bb453e3f31c6e03d1a5594ac3a39f3d49c69a633'
  const publicKey = 'd542be1a577e927d06ace6d3dcd5f02a'
  const hash = Md5.hashStr(timeStamp.toString() + privateKey + publicKey)

  const marvelAuthParams: marvelAuth = {
    ts: timeStamp,
    apikey: publicKey,
    hash
  }

  React.useEffect(() => {
    if (open) {
      setLoading(true)
      client
        .get('', { params: marvelAuthParams })
        .then(
          (response: {
            status: number
            data: { data: { results: any[], total: number } }
          }) => {
            if (response.status === 200) {
              setData(response.data.data.results[0])
              if (response.data.data.results[0].prices[0].price === 0) {
                setPrice(response.data.data.results[0].prices[1].price)
              } else {
                setPrice(response.data.data.results[0].prices[0].price)
              }
              console.log(response.data.data.results[0])
              setLoading(false)
            }
          }
        )
        .catch((err) => {
          console.log(err)
        })
    }
  }, [open])

  return (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {!loading && (
          <>
            <DialogContent dividers>
              <CloseButton onClick={onClose} style={{ display: '' }}>
                <img
                  src={require('../icons/btn-close.png')}
                  alt={'icon of close modal'}
                  width="70%"
                  height="70%"
                />
              </CloseButton>
              <Grid container direction="row">
                <Grid item xs={4}>
                  <img
                    src={`${data?.thumbnail?.path}.${data?.thumbnail?.extension}`}
                    alt={'Ilustration of the comic'}
                    width={'100%'}
                    height={'100%'}
                    style={{ paddingRight: '16px' }}
                  />
                </Grid>
                <Grid item xs={7.5} container direction="column">
                  <div
                    style={{
                      margin: 0,
                      padding: '0 0 10px 0',
                      width: '100%',
                      fontSize: '22px',
                      fontWeight: '600'
                    }}
                  >
                    {' '}
                    {comicInformation.name}{' '}
                  </div>
                  <Typography gutterBottom variant="body2">
                    {data?.description}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <Grid container direction="row" height="56px">
              {!isOnFavourite && (
                <Button
                  onClick={() => {
                    onAddedFavourites({
                      name: comicInformation.name,
                      thumbnailUri: `${data?.thumbnail?.path}.${data?.thumbnail?.extension}`
                    })
                  }}
                  sx={{
                    width: '50%',
                    backgroundColor: '#efefef',
                    '&:hover': { backgroundColor: '#d7d7d7' },
                    borderRadius: '0'
                  }}
                >
                  <img
                    src={require('../icons/btn-favourites-default.png')}
                    alt={'icon of close modal'}
                    style={{
                      width: '10%',
                      position: 'relative',
                      marginRight: '10px'
                    }}
                  />
                  <div style={{ color: 'black' }}> ADD TO FAVOURITES </div>
                </Button>
              )}
              {isOnFavourite && (
                <Button
                  onClick={() => {
                    onDeleteFavourite(comicInformation)
                  }}
                  sx={{
                    width: '50%',
                    backgroundColor: '#3f3636',
                    '&:hover': { backgroundColor: '#2c2525' },
                    borderRadius: '0'
                  }}
                >
                  <img
                    src={require('../icons/btn-favourites-primary.png')}
                    alt={'icon of close modal'}
                    style={{
                      width: '10%',
                      position: 'relative',
                      marginRight: '10px'
                    }}
                  />
                  <div style={{ color: 'red' }}> ADDED TO FAVOURITES </div>
                </Button>
              )}

              <Button
                disabled
                sx={{
                  width: '50%',
                  backgroundColor: '#dbdbdb',
                  borderRadius: '0'
                }}
              >
                <img
                  src={require('../icons/shopping-cart-primary.png')}
                  alt={'icon of close modal'}
                  style={{
                    width: '10%',
                    position: 'relative',
                    marginRight: '10px'
                  }}
                />
                <div style={{ color: 'red' }}> BUY FOR ${price}</div>
              </Button>
            </Grid>
          </>
        )}
      </Dialog>
    </div>
  )
}
