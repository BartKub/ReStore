import { Button, ButtonGroup, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { decrement, increment } from './counterSlice';

export default function ContactPage() {
  // const {data, title} = useSelector((state: CounterState) => state)
  // const dispatch = useDispatch();

  const dispatch = useAppDispatch();
  const {data, title} = useAppSelector(state => state.counter);


  return <>
    <Typography variant="h2">{title}</Typography>
    <Typography variant="h5">Data is: {data}</Typography>
    <ButtonGroup>
      <Button variant='contained' onClick={() => dispatch(increment(1))}>Increment</Button>
      <Button variant='contained' onClick={() => dispatch(decrement(1))}>Decrement</Button>
    </ButtonGroup>
  </>
}
