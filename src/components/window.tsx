import React, {PropsWithChildren} from 'react'
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'

export type WindowProps = {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    windowRoot: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: 2000,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    windowContainer: {
      zIndex: 2001,
      border: '2px solid black',
      backgroundColor: 'white',
      width: '50%',
      height: '50%',
    },
  }),
)

export function Window(props: PropsWithChildren<WindowProps>) {
  const classes = useStyles()
  return <Box className={classes.windowRoot}>
    <Box className={classes.windowContainer}>
      {props.children}
    </Box>
  </Box>
}
