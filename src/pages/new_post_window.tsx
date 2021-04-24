import {NormalWindowContainer, Window} from '../components/window'
import {Box} from '@material-ui/core'
import React from 'react'
import {useHistory} from 'react-router-dom'

export function NewPostWindow() {
  const history = useHistory()

  const onClose = () => {
    history.goBack()
  }
  return <Window onClick={onClose} center>
    <NormalWindowContainer>
      <Box display={'flex'} justifyContent={'space-between'}>
        <h3>New Post</h3>
        <span onClick={onClose}>X</span>
      </Box>
      awa
    </NormalWindowContainer>
  </Window>
}
