import React from 'react'
import {
  CssBaseline,
  AppBar,
  Toolbar,
  alpha,
  InputBase,
  styled,
  createTheme
} from '@mui/material'
import { ReactComponent as MarvelLogo } from '../icons/marvelLogo.svg'
import SearchIcon from '@mui/icons-material/Search'
import { ThemeProvider } from '@emotion/react'
import { grey } from '@mui/material/colors'
import { NavLink } from 'react-router-dom'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  marginLeft: 'auto',
  right: '18%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  width: '350px'
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%'
  }
}))

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900]
    }
  }
})

interface headerProps {
  onSearchChange: (event: any) => void
}

function Header (props: headerProps) {
  const { onSearchChange } = props
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar component="nav" color="primary">
          <Toolbar>
            <NavLink
              style={{ width: '120px', height: '70px' }}
              to={'/'}
            >
              <MarvelLogo width="100%" height="100%" />
            </NavLink>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search an character"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  )
}

export default Header
