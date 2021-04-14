import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { 
  features ,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function Users() {
  const { api } = useContext(FirebaseContext);
  const {
    addUser,
    editUser, 
    deleteUser,
    checkUserExists
  } = api;
  const [data, setData] = useState([]);
  const usersdata = useSelector(state => state.usersdata);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(usersdata.users){
      setData(usersdata.users.filter(user => user.usertype ==='rider'));
    }else{
      setData([]);
    }
  },[usersdata.users]);

  const columns = [
    { title: language.createdAt, field: 'createdAt', editable:'never', defaultSort:'desc',render: rowData => rowData.createdAt?new Date(rowData.createdAt).toLocaleString(dateStyle):null},
    { title: language.first_name, field: 'firstName'},
    { title: language.last_name, field: 'lastName'},
    { title: language.email, field: 'email', editable:'onAdd'},
    { title: language.mobile, field: 'mobile', editable:'onAdd'},
    { title: language.profile_image,  field: 'profile_image', render: rowData => rowData.profile_image?<img alt='Profile' src={rowData.profile_image} style={{width: 50,borderRadius:'50%'}}/>:null, editable:'never'},
    { title: language.account_approve,  field: 'approved', type:'boolean'},
    { title: language.wallet_balance,  field: 'walletBalance', type:'numeric' , editable:'never', initialEditValue: 0},
    { title: language.signup_via_referral, field: 'signupViaReferral', editable:'never' },
    { title: language.referralId,  field: 'referralId', editable:'never', initialEditValue: '' },
  ];

  return (
    usersdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.riders}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
        sorting: true,
      }}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve,reject) => {
            setTimeout(() => {
              checkUserExists(newData).then((res) => {
                if (res.users && res.users.length > 0) {
                  alert(language.user_exists);
                  reject();
                }
                else if(res.error){
                  alert(language.email_or_mobile_issue);
                  reject();
                }
                else{
                  newData['createdByAdmin'] = true;
                  newData['usertype'] = 'rider';
                  newData['createdAt'] = new Date().toISOString();
                  newData['referralId'] = newData.firstName.toLowerCase() + Math.floor(1000 + Math.random() * 9000).toString();
                  dispatch(addUser(newData));
                  resolve();
                }
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editUser(oldData.id,newData));
            }, 600);
          }),
        onRowDelete: oldData =>
          features.AllowCriticalEditsAdmin?
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(deleteUser(oldData.id));
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(language.demo_mode);
            }, 600);
          })
          , 
      }}
    />
  );
}
