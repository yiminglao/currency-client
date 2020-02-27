import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  makeStyles,
  Button
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  textStyle: {
    margin: 20,
    height: 50
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function App() {
  const classes = useStyles();
  const [currencys, setCurrecncys] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [baseAmount, setBaseAmount] = useState(null);
  const [targetCurrency, setTargetCurrency] = useState(null);
  const [targetAmount, setTargetAmount] = useState(null);

  const getCurrencyList = () => {
    fetch("http://127.0.0.1:8000", {
      method: "GET"
    })
      .then(res => res.json())
      .then(result => {
        setCurrecncys(result);
      });
  };

  const getCurrency = () => {
    if (baseCurrency && baseAmount && targetCurrency) {
      const formBody = {
        base_currency: baseCurrency,
        base_amount: baseAmount,
        target_currency: targetCurrency
      };
      fetch("http://127.0.0.1:8000/getcurrency", {
        method: "POST",
        body: JSON.stringify(formBody),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(result => {
          setTargetAmount(result && result.targetAmount);
        });
    }
  };

  useEffect(() => {
    getCurrencyList();
  }, []);

  return (
    <div className="App">
      <Container maxWidth="md">
        <Grid container justify="center" alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">Currency Converter</Typography>
            <Typography variant="h5" className={classes.textStyle}>
              {targetAmount &&
                `${baseAmount} ${baseCurrency} equals ${targetAmount} ${targetCurrency}`}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Base Currency</InputLabel>
              <Select
                fullWidth
                defaultValue={""}
                onChange={e => setBaseCurrency(e.target.value)}
              >
                {currencys &&
                  currencys.map((x, index) => (
                    <MenuItem key={index} value={x.currency}>
                      {x.currency}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" style={{ width: "80%" }}>
              <TextField
                id="outlined-basic"
                label="Base Amount"
                variant="outlined"
                onChange={e => setBaseAmount(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <ArrowForwardIcon />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.formControl}
            >
              <InputLabel>Target Currency</InputLabel>
              <Select
                fullWidth
                defaultValue={""}
                onChange={e => setTargetCurrency(e.target.value)}
              >
                {currencys &&
                  currencys.map((x, index) => (
                    <MenuItem key={index} value={x.currency}>
                      {x.currency}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<SendIcon />}
            onClick={() => getCurrency()}
          >
            Send
          </Button>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
