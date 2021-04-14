import React, { useState, useEffect, useContext } from 'react';
import {
    Grid,
    Button,
    Typography,
    TextField
} from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import { language } from 'config';
import { makeStyles } from '@material-ui/core/styles';
import UsersCombo from '../components/UsersCombo';
import { FirebaseContext } from 'common';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    container: {
        zIndex: "12",
        color: "#FFFFFF",
        alignContent: 'center'
    },
    title: {
        color: "#000",
    },
    gridcontainer: {
        alignContent: 'center'
    },
    items: {
        margin: 0,
        width: '100%'
    },
    input: {
        fontSize: 18,
        color: "#000"
    },
    inputdimmed: {
        fontSize: 18,
        color: "#737373"
    },
    carphoto: {
        height: '18px',
        marginRight: '10px'
    },
    buttonStyle: {
        margin: 0,
        width: '100%',
        height: '100%'
    }
}));

export default function AddMoney(props) {
    const { api } = useContext(FirebaseContext);
    const {
        addToWallet
    } = api;
    const dispatch = useDispatch();
    const classes = useStyles();
    const userdata = useSelector(state => state.usersdata);
    const [users, setUsers] = useState(null);
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
    const [userCombo, setUserCombo] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (userdata.users) {
            let arr = [];
            for (let i = 0; i < userdata.users.length; i++) {
                let user = userdata.users[i];
                arr.push({
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'mobile': user.mobile,
                    'email': user.email,
                    'uid': user.id,
                    'desc': user.firstName + ' ' + user.lastName + ' (' + user.mobile + ') ' + user.email,
                    'pushToken': user.pushToken
                });
            }
            setUsers(arr);
        }
    }, [userdata.users]);

    const handleAddBalance = () => {
        if(userCombo && userCombo.uid && amount> 0){
            dispatch(addToWallet(userCombo.uid,amount));
            setCommonAlert({ open:true, msg: language.success});
        }else{
            setCommonAlert({ open:true, msg: language.no_details_error});
        }
    }

    const handleCommonAlertClose = (e) => {
        e.preventDefault();
        setCommonAlert({ open: false, msg: '' })
    };

    return (
        <div className={classes.container}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5" className={classes.title}>
                            {language.add_to_wallet}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {users ?
                            <UsersCombo
                                className={classes.items}
                                placeholder={language.select_user}
                                users={users}
                                value={userCombo}
                                onChange={(event, newValue) => {
                                    setUserCombo(newValue);
                                }}
                            />
                            : null}
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField
                            id="datetime-local"
                            label={language.amount}
                            type="text"
                            variant="outlined"
                            fullWidth
                            className={classes.commonInputStyle}
                            InputProps={{
                                className: classes.input
                            }}
                            value={amount}
                            onChange={event => {
                                const { value } = event.target;
                                setAmount(value === '' || value === null || value === undefined? 0:parseFloat(value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <Button
                            size="large"
                            onClick={handleAddBalance}
                            variant="contained"
                            color="primary"
                            className={classes.buttonStyle}
                        >
                            {language.add_to_wallet}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
        </div>
    );
}