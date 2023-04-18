import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export enum SortType {
  NameAscending = 'Sort by Name',
  NameDescending = 'Sort by Name (Descending) ',
  DateAscending = 'Sort by Creation Date',
  DateDescending = 'Sort by Creation Date (Descending) ',
  None = 'Sort by',
}

interface buttonFilterProps {
  setFilter: (sortType: SortType) => void
}

export default function PositionedMenu (props: buttonFilterProps) {
  const { setFilter } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [buttonText, setButtonText] = React.useState<string>('Sort by')
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleItemClick = (sortType: SortType) => {
    setAnchorEl(null)
    setButtonText(sortType)
    setFilter(sortType)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Button
        id="positioned-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        color="primary"
        sx={{
          width: '250px',
          height: '50px',
          border: 'solid 1px',
          borderRadius: 0,
          boxShadow: 'none',
          borderColor: '#ddd3d3',
          backgroundColor: 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: 'white',
            borderColor: 'black',
            boxShadow: 'none'
          }
        }}
      >
        <div style={{ width: '100%', textAlign: 'initial' }}>{buttonText}</div>
        <ExpandMoreIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        elevation={0}
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: 'solid 1px #ddd3d3',
            marginTop: '2px',
            width: '250px'
          }
        }}
      >
        <MenuItem
          onClick={() => {
            handleItemClick(SortType.NameAscending)
          }}
          sx={{ fontSize: '14px' }}
        >
          Sort by Name
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleItemClick(SortType.DateAscending)
          }}
          sx={{ fontSize: '14px' }}
        >
          Sort by Creation Date
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleItemClick(SortType.NameDescending)
          }}
          sx={{ fontSize: '14px' }}
        >
          {'Sort by Name (Descending)'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleItemClick(SortType.DateDescending)
          }}
          sx={{ fontSize: '14px' }}
        >
          {'Sort by Creation Date (Descending)'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleItemClick(SortType.None)
          }}
          sx={{ fontSize: '14px' }}
        >
          Reset filter
        </MenuItem>
      </Menu>
    </div>
  )
}
