import {NormalWindowContainer, Window} from '../components/window'
import {Box, createStyles, makeStyles, TextField, Theme} from '@material-ui/core'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
    },
  }),
)


export function NewPostWindow() {
  const history = useHistory()
  const classes = useStyles()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isText, setIsText] = useState(true)
  const [textPostChoices, setTextPostChoices] = useState<Array<{ text: string, key: number }>>([{
    text: '',
    key: Math.random(),
  }])

  const onClose = () => {
    history.goBack()
  }
  return <Window onClick={onClose} center>
    <NormalWindowContainer>
      <Box display={'flex'} justifyContent={'space-between'}>
        <h3>New Post</h3>
        <span onClick={onClose}>X</span>
      </Box>
      <div className={classes.form}>
        <TextField label="Title" variant="filled" value={title} onChange={e => setTitle(e.target.value)}/>
        <TextField multiline label="Description" rows={4} variant="outlined" value={description}
                   onChange={e => setDescription(e.target.value)}/>
        <ToggleButtonGroup
          value={isText ? 'text' : 'image'}
          exclusive
          onChange={() => setIsText(!isText)}>
          <ToggleButton value="text" aria-label="left aligned">
            Text
          </ToggleButton>
          <ToggleButton value="image" aria-label="centered">
            Image
          </ToggleButton>
        </ToggleButtonGroup>
        {isText ? <NewPostText textPostChoices={textPostChoices} setTextPostChoices={setTextPostChoices}/> : null}
      </div>
    </NormalWindowContainer>
  </Window>
}

type NewPostTextProps = {
  textPostChoices: Array<{ text: string, key: number }>,
  setTextPostChoices: (data: Array<{ text: string, key: number }>) => void
}

function NewPostText({textPostChoices, setTextPostChoices}: NewPostTextProps) {
  const [focusedKey, setFocusedKey] = useState(textPostChoices[0].key)
  console.log(focusedKey, textPostChoices)

  return <>
    {textPostChoices.map(({text, key}, i) => <TextField
      key={key} label="Title" variant="filled" value={text} autoFocus={key === focusedKey}
      onChange={e => {
        const newList = [...textPostChoices]
        const newText = {...newList[i]}
        newText.text = e.target.value
        newList[i] = newText
        setTextPostChoices(newList)
      }}
      onKeyDown={e => {
        if (e.code === 'Enter') {
          const newList = [...textPostChoices]
          const newKey = Math.random()
          newList.splice(i + 1, 0, {text: '', key: newKey})
          setFocusedKey(newKey)
          setTextPostChoices(newList)
        }
      }}
    />)}
  </>
}
