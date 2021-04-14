/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});


export default function UsersCombo(props) {
  const classes = useStyles();
  return (
    <Autocomplete
      value={props.value}
      id="user-select"
      style={props.style}
      options={props.users}
      classes={{
        option: classes.option,
      }}
      onChange={props.onChange}
      autoHighlight
      getOptionLabel={(option) => option.desc}
      getOptionSelected={(option) => option.desc}
      renderOption={(option) => (
        <React.Fragment>
          {option.desc}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.placeholder}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off' // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}