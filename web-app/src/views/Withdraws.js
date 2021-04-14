import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import { language } from 'config';
import { FirebaseContext } from 'common';

const Withdraws = () => {
  const { api } = useContext(FirebaseContext);
  const {
    completeWithdraw
  } = api;
  const dispatch = useDispatch();
  const columns =  [
      { title: 'ID', field: 'id',editable: 'never' },
      { title: language.requestDate, field: 'date',editable: 'never' },
      { title: language.driver_name,field: 'name',editable: 'never'},
      { title: language.amount, field: 'amount',editable: 'never' },
      { title: language.processed, field: 'processed', type: 'boolean',editable: 'never'},  
      { title: language.processDate, field: 'procesDate',editable: 'never'}, 
      { title: language.bankName, field: 'bankName',editable: 'never' },
      { title: language.bankCode, field: 'bankCode' ,editable: 'never'},
      { title: language.bankAccount, field: 'bankAccount',editable: 'never' }, 
  ];
  const [data, setData] = useState([]);
  const withdrawdata = useSelector(state => state.withdrawdata);

  useEffect(()=>{
        if(withdrawdata.withdraws){
            setData(withdrawdata.withdraws);
        }else{
          setData([]);
        }
  },[withdrawdata.withdraws]);
  
  return (
    withdrawdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.booking_title}
      columns={columns}
      data={data}
      options={{
        exportButton: true
      }}
      actions={[
        rowData => ({
          icon: 'check',
          tooltip: language.process_withdraw,
          disabled: rowData.processed,
          onClick: (event, rowData) => {
            dispatch(completeWithdraw(rowData));
          }         
        }),
      ]}
    />
  );
}

export default Withdraws;
