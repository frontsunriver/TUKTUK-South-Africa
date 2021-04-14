import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { features, language } from 'config';
import { FirebaseContext } from 'common';

export default function Notifications() {
  const { api } = useContext(FirebaseContext);
  const {
    sendNotification,
    editNotifications
  } = api;

  const columns =  [
      {
        title: language.device_type,
        field: 'devicetype',
        lookup: { All: 'All', ANDROID: 'Android', IOS: 'iOS' },
      },
      {
        title: language.user_type,
        field: 'usertype',
        lookup: { rider: language.rider, driver: language.driver },
      },
      { title: language.title,field: 'title'},
      { title: language.body, field: 'body' },
  ];

  const [data, setData] = useState([]);
  const notificationdata = useSelector(state => state.notificationdata);
  const dispatch = useDispatch();

  useEffect(()=>{
        if(notificationdata.notifications){
            setData(notificationdata.notifications);
        }
  },[notificationdata.notifications]);

  return (
    notificationdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.push_notification_title}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData.push(newData);
              features.AllowCriticalEditsAdmin?
                dispatch(sendNotification(newData))
                :
                alert(language.demo_mode);
              dispatch(editNotifications(newData,"Add"));
            }, 600);
          }),

          onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const tblData = data;
              tblData[tblData.indexOf(oldData)] = newData;
              dispatch(editNotifications(newData,"Update"));
            }, 600);
          }),
        onRowDelete: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              dispatch(editNotifications(newData,"Delete"));
            }, 600);
          }),
      }}
    />
  );
}
