import {NormalWindowContainer, Window, WindowContainerTitle} from '../components/window'
import {
  Box,
  Checkbox,
  CircularProgress,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import Button from '@material-ui/core/Button'
import {network} from '../network/network'
import {useDropzone} from 'react-dropzone'
import {getFBAuth} from '../auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 24px',
      paddingBottom: '24px',
    },
    formItem: {
      marginTop: '16px',
    },
    fullWidth: {
      width: '100%',
    },
    labelText: {
      display: 'inline',
    },
    notifyTextField: {
      width: '100px',
    },
    emptyOptionTextField: {
      opacity: 0.5,
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
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isText, setIsText] = useState(true)
  const [textPostChoices, setTextPostChoices] = useState<Array<{ text: string, key: number }>>([{
    text: '',
    key: Math.random(),
  }])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [user, isUserLoading] = useAuthState(getFBAuth())

  useEffect(() => {
    if (!isUserLoading && !user) {
      history.push('/login', {from: '/new_post', title: 'Login to Post'})
    }
  }, [user, isUserLoading])

  const onClose = () => {
    history.goBack()
  }
  const post = async () => {
    if (isText) {
      if (title === '') {
        alert('Title cannot be empty.')
        return
      } else if (textPostChoices.filter(({text}) => text !== '').length <= 1) {
        alert('Must have 2 or more options')
        return
      }
      setIsLoading(true)
      await network.newTextPost(title, description, textPostChoices.map(c => c.text), parseInt(targetVotes), isAnonymous)
    } else {
      if (title === '') {
        alert('Title cannot be empty.')
        return
      } else if (!imageFile) {
        alert('Must choose an image.')
        return
      }
      setIsLoading(true)
      await network.newImagePost(title, description, parseInt(targetVotes), isAnonymous, imageFile!)
    }
    setIsLoading(false)
    onClose()
  }
  return <Window onClick={onClose} center>
    <NormalWindowContainer>
      <WindowContainerTitle title={'New Post'} onClose={onClose}/>
      <div className={classes.form}>
        <TextField className={classes.formItem + ' ' + classes.fullWidth} label="Title" variant="filled" value={title}
                   onChange={e => setTitle(e.target.value)}/>
        <TextField className={classes.formItem + ' ' + classes.fullWidth} multiline label="Description (Optional)"
                   rows={4} variant="outlined"
                   value={description}
                   onChange={e => setDescription(e.target.value)}/>
        <Box className={classes.formItem + ' ' + classes.fullWidth} display={'flex'} alignItems={'center'}
             justifyContent={'space-between'}>
          <Typography className={classes.labelText}>Notify me when more than this many people voted</Typography>
          <TextField
            className={classes.notifyTextField}
            label="Count"
            type="number"
            variant="filled"
            value={targetVotes}
            onChange={e => setTargetVotes(e.target.value)}
          />
        </Box>
        <Box className={classes.formItem + ' ' + classes.fullWidth} display={'flex'} alignItems={'center'}
             justifyContent={'space-between'}
             onClick={() => setIsAnonymous(!isAnonymous)}>
          <Typography className={classes.labelText}>Post anonymously</Typography>
          <Checkbox
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            inputProps={{'aria-label': 'primary checkbox'}}
          />
        </Box>
        <hr className={classes.formItem + ' ' + classes.fullWidth}
            style={{border: 'none', borderTop: '1px solid #c0c0c0'}}/>
        <ToggleButtonGroup
          className={classes.formItem}
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
        {isLoading ? <CircularProgress className={classes.formItem}/> :
          <Button className={classes.formItem + ' ' + classes.fullWidth} variant="outlined"
                  onClick={post}>Post</Button>}
      </div>
    </NormalWindowContainer>
  </Window>
}

type NewPostTextProps = {
  textPostChoices: Array<{ text: string, key: number }>,
  setTextPostChoices: (data: Array<{ text: string, key: number }>) => void
}

function NewPostText({textPostChoices, setTextPostChoices}: NewPostTextProps) {
  const classes = useStyles()
  const [focusedKey, setFocusedKey] = useState(textPostChoices[0].key)
  console.log(focusedKey, textPostChoices)

  return <>
    {textPostChoices.map(({text, key}, i) => <TextField
      className={classes.formItem + ' ' + classes.fullWidth + ' ' + ((text === '' && i !== 0) ? classes.emptyOptionTextField : '')}
      key={key} label={`Option ${i + 1}`} variant="filled" value={text} autoFocus={key === focusedKey}
      onChange={e => {
        const newList = [...textPostChoices]
        const newText = {...newList[i]}
        newText.text = e.target.value
        newList[i] = newText
        setTextPostChoices(newList)
      }}
      onKeyDown={e => {
        if (e.code === 'Enter' && text !== '') {
          const newList = [...textPostChoices]
          const newKey = Math.random()
          newList.splice(i + 1, 0, {text: '', key: newKey})
          setFocusedKey(newKey)
          setTextPostChoices(newList)
        } else if (e.code === 'Backspace' && text === '' && i !== 0) {
          const newList = [...textPostChoices]
          newList.splice(i, 1)
          setFocusedKey(textPostChoices[i - 1].key)
          setTextPostChoices(newList)
          // todo fix focus
        }
      }}
    />)}
    <Button
      style={{alignSelf: 'flex-start', marginTop: '8px'}}
      variant="outlined"
      startIcon={<AddIcon/>}
      onClick={() => {
        const newList = [...textPostChoices]
        const newKey = Math.random()
        newList.push({text: '', key: newKey})
        setFocusedKey(newKey)
        setTextPostChoices(newList)
      }}>
      Add Option
    </Button>
  </>
  // todo delete post
}

type NewPostImageProps = {
  imageFile: File | null,
  setImageFile: (file: File | null) => void
}


function NewPostImage({imageFile, setImageFile}: NewPostImageProps) {
  const classes = useStyles()
  const onDrop = useCallback(acceptedFiles => {
    setImageFile(acceptedFiles[0])
  }, [setImageFile])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, maxFiles: 1})
  const selectedImageUrl = useMemo(() => imageFile ? (URL.createObjectURL(imageFile)) : null, [imageFile])

  let dragUI = isDragActive ?
    <Typography>Drop the image here...</Typography> :
    <Typography>Drag and drop an image here, or click to select an image.</Typography>
  if (selectedImageUrl) {
    dragUI = <img className={classes.fullWidth} src={selectedImageUrl} alt={'preview'}/>
  }

  return <>
    <div className={classes.formItem + ' ' + classes.fullWidth}
         style={{cursor: 'pointer', textAlign: 'center', padding: '8px 0'}} {...getRootProps()}>
      <input {...getInputProps()} />
      {dragUI}
    </div>
  </>
}
