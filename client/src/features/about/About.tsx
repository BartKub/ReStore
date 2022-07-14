import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from '@mui/material';
import { useState } from 'react';
import agent from '../../app/api/agent';

export default function AboutPage() {

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  function getValidationError(){
  agent.TestErrors.getValidationError().then(()=>console.log('sgould not see this')).catch(err=>setValidationErrors(err));
  }

  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get400Error().catch((err) => console.log(err))
          }
        >
          Test 400
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get401Error().catch((err) => console.log(err))
          }
        >
          Test 401
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get404Error().catch((err) => console.log(err))
          }
        >
          Test 404
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get500Error().catch((err) => console.log(err))
          }
        >
          Test 500
        </Button>
        <Button
          variant="contained"
          onClick={getValidationError}
        >
          Test Validation Errors
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && 
        <Alert severity='error'>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((err, i) => (
              <ListItem key={i}>{err}</ListItem>  
            ))}
          </List>
        </Alert>
      }
    </Container>
  );
}
