import { LoadingButton } from "@mui/lab";
import { Container, Paper, Avatar, Typography, Box, TextField, Grid, Alert, AlertTitle, List, ListItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register(){
    const history = useHistory();
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
      mode: 'all'
    })
    
    function handleApiErrors(errors:any){
        if(errors){
            errors.forEach((error: string) => {
                if(error.includes('Password')){
                    setError('password', {message: error})
                } else if (error.includes('Email')){
                    setError('email', {message: error})
                } else if (error.includes('Username')){
                    setError('username', {message: error})
                }
            });
        }
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit((
                data => agent.Account.register(data)
                    .then(() => {
                        toast.success('Registration successfull. You can now login.');
                        history.push('/login');
                    })
                    .catch(error => handleApiErrors(error))
                ))} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                autoFocus
                {...register('username', {required: 'Username is required'})}
                error={!!errors.username}
                helperText={errors?.username?.message?.toString()}
              />
               <TextField
                margin="normal"
                fullWidth
                label="Email address"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^\w+[\w-.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                        message: 'Email is invalid'
                    }
                })}
                error={!!errors.email}
                helperText={errors?.username?.message?.toString()}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                {...register('password', {
                    required: 'Password is required',
                    pattern:{
                        value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                        message: 'Password is invalid'
                    }
                })}
                error={!!errors.password}
                helperText={errors?.password?.message?.toString()}
              />
             
              <LoadingButton
                disabled={!isValid }
                loading={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </LoadingButton>
              <Grid container>
                <Grid item>
                  <Link to='/login'>
                    {"Already an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
        </Container>
    );
} 