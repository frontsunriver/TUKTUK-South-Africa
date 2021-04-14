import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector} from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { language } from 'config';

export default function Earningreports() {

    const columns =  [
        { title: language.year,field: 'year'},
        { title: language.months, field: 'monthsName' },
        { title: language.Gross_trip_cost, field: 'tripCost' },
        { title: language.trip_cost_driver_share, field: 'rideCost' },
        { title: language.convenience_fee, field: 'convenienceFee' },
        
        { title: language.Discounts, field: 'discountAmount' },
        { title: language.Profit,  field: 'profit', render: rowData => rowData.convenienceFee - rowData.discountAmount , editable:'never'},
        
    ];

  const [data, setData] = useState([]);
  const earningreportsdata = useSelector(state => state.earningreportsdata);

  useEffect(()=>{
        if(earningreportsdata.Earningreportss){
            setData(earningreportsdata.Earningreportss);
        }
  },[earningreportsdata.Earningreportss]);

  return (
    earningreportsdata.loading? <CircularLoading/>:
    <MaterialTable
      title={language.earning_reports}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
      }}
      
    />
  );
}
