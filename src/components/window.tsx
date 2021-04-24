import React, {PropsWithChildren} from 'react'
import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'

export type WindowProps = {
  backgroundColor?: string,
  onClick?: () => void,
  center?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    windowRoot: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: 2000,
      justifyContent: 'center',
      alignItems: 'center',
    },
    windowContainer: {
      zIndex: 2001,
      border: '2px solid black',
      backgroundColor: 'white',
      width: '100%',
      maxWidth: '600px',
      height: '100%',
      maxHeight: '800px',
      overflowY: 'scroll',
    },
  }),
)

export function Window(props: PropsWithChildren<WindowProps>) {
  const classes = useStyles()
  return <Box className={classes.windowRoot}
              bgcolor={props.backgroundColor || 'rgba(0,0,0,0.5)'}
              onClick={props.onClick}
              display={props.center ? 'flex' : 'block'}>
    {props.children}
  </Box>
}

export function NormalWindowContainer(props: PropsWithChildren<{}>) {
  const classes = useStyles()
  return <Box className={classes.windowContainer} onClick={e => e.stopPropagation()}>
    {props.children}
  </Box>
}
