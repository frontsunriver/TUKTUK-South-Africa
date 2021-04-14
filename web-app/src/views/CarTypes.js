import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import {
  features,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function CarTypes() {
  const { api } = useContext(FirebaseContext);
  const {
    editCarType
  } = api;
  const columns = [
    { title: language.image, field: 'image', render: rowData => <img alt='Car' src={rowData.image} style={{ width: 50 }} /> },
    { title: language.name, field: 'name' },
    { title: language.base_fare, field: 'base_fare', type: 'numeric' },
    { title: language.rate_per_unit_distance, field: 'rate_per_unit_distance', type: 'numeric' },
    { title: language.rate_per_hour, field: 'rate_per_hour', type: 'numeric' },
    { title: language.min_fare, field: 'min_fare', type: 'numeric' },
    { title: language.convenience_fee, field: 'convenience_fees', type: 'numeric' },
    {
      title: language.convenience_fee_type,
      field: 'convenience_fee_type',
      lookup: { flat: language.flat, percentage: language.percentage },
    },
    { title: language.extra_info, field: 'extra_info' }
  ];
  const [data, setData] = useState([]);
  const cartypes = useSelector(state => state.cartypes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartypes.cars) {
      setData(cartypes.cars);
    } else {
      setData([]);
    }
  }, [cartypes.cars]);

  return (
    cartypes.loading ? <CircularLoading /> :
      <MaterialTable
        title={language.car_type}
        columns={columns}
        data={data}
        options={{
          exportButton: true
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve,reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData.push(newData);
                  dispatch(editCarType(tblData), "Add");
                }, 600);
              } else {
                alert(language.demo_mode);
                reject();
              }
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve,reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData[tblData.indexOf(oldData)] = newData;
                  dispatch(editCarType(tblData), "Update");
                }, 600);
              } else {
                alert(language.demo_mode);
                reject();
              }
            }),
          onRowDelete: oldData =>
            new Promise((resolve,reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData.splice(tblData.indexOf(oldData), 1);
                  dispatch(editCarType(tblData), "Delete");
                }, 600);
              } else {
                alert(language.demo_mode);
                reject();
              }
            }),
        }}
      />
  );
}
