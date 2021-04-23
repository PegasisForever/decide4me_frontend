import React from 'react'
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      height: '56px',
      borderBottom: '2px solid black',
      zIndex: 1000,
      bgColor: 'white',
      display:'flex',
      justifyContent:'space-between'
    },
  }),
)

export function HomeNavbar() {
  const classes = useStyles()
  return <Box className={classes.bar}>
    Decide4me
    <Button variant="outlined">Login</Button>
  </Box>
}
