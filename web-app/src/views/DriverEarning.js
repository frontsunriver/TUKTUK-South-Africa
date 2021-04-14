import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { language } from 'config';

export default function DriverEarning() {

    const columns =  [
        { title: language.year,field: 'year'},
        { title: language.months, field: 'monthsName' },
        { title: language.driver_name, field: 'driverName'},
        { title: language.vehicle_reg_no, field: 'driverVehicleNo' },
        { title: language.earning_amount, field: 'driverShare' },
        
    ];

  const [data, setData] = useState([]);
  const driverearningdata = useSelector(state => state.driverearningdata);

  useEffect(()=>{
        if(driverearningdata.driverearnings){
            setData(driverearningdata.driverearnings);
        }
  },[driverearningdata.driverearnings]);

  return (
    driverearningdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.driver_earning}
      columns={columns}
      data={data}
      
      options={{
        exportButton: true,
        grouping: true,
      }}
      
    />
  );
}
