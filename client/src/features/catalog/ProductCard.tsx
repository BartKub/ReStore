import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import { Product } from '../../app/models/product';
import { currencyFormat } from '../../app/util/util';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const {setBasket} = useStoreContext();

  function handleAddItem(product: number){
    setLoading(true);
    agent.Basket.addItem(product)
    .then((response) => {
      setBasket(response);
    })
    .catch(error => console.log(error))
    .finally(() => setLoading(false));
  }
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: 'contain',
          bgcolor: 'primary.light',
        }}
        component="img"
        image={product.pictureUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5" component="div">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.brand}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={loading} onClick={()=> handleAddItem(product.id)} size="small">Add to card</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
