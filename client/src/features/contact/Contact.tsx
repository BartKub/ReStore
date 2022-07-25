import { Button, ButtonGroup, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, decrement, DECREMENT_COUNTER, increment, INCREMENT_COUNTER } from './counterReducer';

export default function ContactPage() {
  const {data, title} = useSelector((state: CounterState) => state)
  const dispatch = useDispatch();


  return <>
    <Typography variant="h2">{title}</Typography>
    <Typography variant="h5">Data is: {data}</Typography>
    <ButtonGroup>
      <Button variant='contained' onClick={() => dispatch(increment())}>Increment</Button>
      <Button variant='contained' onClick={() => dispatch(decrement())}>Decrement</Button>
    </ButtonGroup>
  </>
}
