import {NormalWindowContainer, Window} from '../components/window'
import {Box, createStyles, makeStyles, TextField, Theme} from '@material-ui/core'
import React, {useCallback, useMemo, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import Button from '@material-ui/core/Button'
import {network} from '../network/network'
import {useDropzone} from 'react-dropzone'

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
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetVotes, setTargetVotes] = useState('10')
  const [isText, setIsText] = useState(true)
  const [textPostChoices, setTextPostChoices] = useState<Array<{ text: string, key: number }>>([{
    text: '',
    key: Math.random(),
  }])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const onClose = () => {
    history.goBack()
  }
  const post = async () => {
    setIsLoading(true)
    if (isText) {
      await network.newTextPost(title, description, textPostChoices.map(c => c.text), parseInt(targetVotes))
    } else {
      await network.newImagePost(title, description, parseInt(targetVotes), imageFile!)
    }
    setIsLoading(false)
    onClose()
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
        <div>
          <span>Notify me when more than </span>
          <TextField
            label="Number"
            type="number"
            variant="filled"
            value={targetVotes}
            onChange={e => setTargetVotes(e.target.value)}
          />
          <span> people voted</span>
        </div>
        <ToggleButtonGroup
          value={isText ? 'text' : 'image'}
          exclusive
          onChange={(_, value) => {
            if (value) setIsText(value === 'text')
          }}>
          <ToggleButton value="text" aria-label="left aligned">
            Text
          </ToggleButton>
          <ToggleButton value="image" aria-label="centered">
            Image
          </ToggleButton>
        </ToggleButtonGroup>
        {isText ? <NewPostText textPostChoices={textPostChoices} setTextPostChoices={setTextPostChoices}/> :
          <NewPostImage imageFile={imageFile} setImageFile={setImageFile}/>}
        {isLoading ? <span>Loading</span> : <Button variant="outlined" onClick={post}>Upload</Button>}
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

type NewPostImageProps = {
  imageFile: File | null,
  setImageFile: (file: File | null) => void
}


function NewPostImage({imageFile, setImageFile}: NewPostImageProps) {
  const onDrop = useCallback(acceptedFiles => {
    setImageFile(acceptedFiles[0])
  }, [setImageFile])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, maxFiles: 1})
  const memoizedValue = useMemo(() => imageFile ? (URL.createObjectURL(imageFile)) : null, [imageFile])

  return <>
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
    {memoizedValue ? <img src={memoizedValue} alt={'preview'}/> : null}

  </>
}
