import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import {
  features,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

export default function Promos() {
  const { api } = useContext(FirebaseContext);
  const {
    editPromos
  } = api;

  const columns = [
    { title: language.promo_name, field: 'promo_name' },
    { title: language.description, field: 'promo_description' },
    {
      title: language.title,
      field: 'promo_discount_type',
      lookup: { flat: language.flat, percentage: language.percentage },
    },
    { title: language.promo_discount_value, field: 'promo_discount_value', type: 'numeric' },
    { title: language.max_limit, field: 'max_promo_discount_value', type: 'numeric' },
    { title: language.min_limit, field: 'min_order', type: 'numeric' },
    { title: language.end_date, field: 'promo_validity', render: rowData => rowData.promo_validity ? new Date(rowData.promo_validity).toLocaleDateString(dateStyle) : null },
    { title: language.promo_usage, field: 'promo_usage_limit', type: 'numeric' },
    { title: language.promo_used_by, field: 'user_avail', editable: 'never' }
  ];

  const [data, setData] = useState([]);
  const promodata = useSelector(state => state.promodata);
  const dispatch = useDispatch();

  useEffect(() => {
    if (promodata.promos) {
      setData(promodata.promos);
    } else {
      setData([]);
    }
  }, [promodata.promos]);

  return (
    promodata.loading ? <CircularLoading /> :
      <MaterialTable
        title={language.promo_offer}
        columns={columns}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData.push(newData);
                  dispatch(editPromos(tblData));
                }, 600);
              } else {
                alert(language.demo_mode);
                reject();
              }
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData[tblData.indexOf(oldData)] = newData;
                  dispatch(editPromos(tblData));
                }, 600);
              } else {
                alert(language.demo_mode);
                reject();
              }
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              if (features.AllowCriticalEditsAdmin) {
                setTimeout(() => {
                  resolve();
                  const tblData = data;
                  tblData.splice(tblData.indexOf(oldData), 1);
                  dispatch(editPromos(tblData));
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
