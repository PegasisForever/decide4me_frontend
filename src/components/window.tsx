import React, {PropsWithChildren} from 'react'
import {Box, createStyles, IconButton, makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import {Close} from '@material-ui/icons'

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
    windowContainer: props => ({
      zIndex: 2001,
      backgroundColor: 'white',
      width: 'calc(100% - 64px)',
      maxWidth: '600px',
      // @ts-ignore
      height: props.height || 'calc(100% - 64px)',
      maxHeight: '800px',
      overflowY: 'auto',
      position:'relative'
    }),
    windowContainerTitle: {
      zIndex: 2100,
      paddingTop: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      left: '0',
      top: '0',
      right: '0',
      backgroundColor:'white',
    },
    title: {
      marginLeft: '28px',
      fontSize: '1.3rem',
    },
    closeButton: {
      marginRight: '16px',
    },
  }),
)

export function Window(props: PropsWithChildren<WindowProps>) {
  const classes = useStyles()
  return <Box className={classes.windowRoot}
              bgcolor={props.backgroundColor || 'rgba(0,0,0,0.4)'}
              onClick={props.onClick}
              display={props.center ? 'flex' : 'block'}>
    {props.children}
  </Box>
}

export function NormalWindowContainer(props: PropsWithChildren<{ height?: string }>) {
  const classes = useStyles({height: props.height})
  return <Paper elevation={2} className={classes.windowContainer} onClick={e => e.stopPropagation()}>
    {props.children}
  </Paper>
}

export function WindowContainerTitle({title, onClose}: { title: string, onClose: () => void }) {
  const classes = useStyles()
  return <Box className={classes.windowContainerTitle} onClick={e => e.stopPropagation()}>
    <Typography className={classes.title}>{title}</Typography>
    <IconButton className={classes.closeButton} onClick={onClose}>
      <Close/>
    </IconButton>
  </Box>
}
