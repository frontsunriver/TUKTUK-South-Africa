import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { 
  features,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function CancellationReasons() {
  const { api } = useContext(FirebaseContext);
  const {
    editCancellationReason
  } = api;
  const columns = [
    { title: language.reason, field: 'label' ,render: rowData => <span>{rowData.label}</span>}
  ];
  
  const [data, setData] = useState([]);
  const cancelreasondata = useSelector(state => state.cancelreasondata);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cancelreasondata.complex) {
      setData(cancelreasondata.complex);
    }else{
      setData([]);
    }
  }, [cancelreasondata.complex]);

  return (
    cancelreasondata.loading ? <CircularLoading /> :
      <MaterialTable
        title={language.cancellation_reasons}
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          pageSize: 10
        }}
        editable={features.AllowCriticalEditsAdmin ? {
            onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                newData.value = tblData.length
                tblData.push(newData);
                dispatch(editCancellationReason(tblData, "Add"));
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                tblData[tblData.indexOf(oldData)] = newData;
                dispatch(editCancellationReason(tblData, "Update"));
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                tblData.splice(tblData.indexOf(oldData), 1);
                for(let i=0;i<tblData.length;i++){
                  tblData[i].value = i;
                }
                dispatch(editCancellationReason(tblData, "Delete"));
              }, 600);
            }),
        } : null}
      />
  );
}
