import React,{ useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import ConfirmationDialogRaw from '../components/ConfirmationDialogRaw';
import { 
  features,
  dateStyle,
  language
} from 'config';
import { FirebaseContext } from 'common';

const BookingHistory = () => {
  const { api } = useContext(FirebaseContext);
  const {
    cancelBooking
  } = api;
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [role, setRole] = useState(null);
  
  const columns =  [
      { title: language.booking_id, field: 'id' },
      { title: language.booking_date, field: 'tripdate', render: rowData => rowData.tripdate?new Date(rowData.tripdate).toLocaleString(dateStyle):null},
      { title: language.car_type, field: 'carType' },
      { title: language.customer_name,field: 'customer_name'},
      { title: language.pickup_address, field: 'pickupAddress' },
      { title: language.drop_address, field: 'dropAddress' },
      { title: language.assign_driver, field: 'driver_name' },
      { title: language.booking_status, field: 'status', render: rowData => <span>{language[rowData.status]}</span> },
      { title: language.cancellation_reason, field: 'reason'},
      { title: language.otp, field: 'otp', render: rowData => rowData.status ==='NEW' || rowData.status === 'ACCEPTED' ?<span>{rowData.otp}</span>:null },
      { title: language.trip_cost, field: 'trip_cost' },
      { title: language.trip_start_time, field: 'trip_start_time' },
      { title: language.trip_end_time, field: 'trip_end_time' },
      { title: language.total_time, field: 'total_trip_time' },
      { title: language.distance, field: 'distance' },
      { title: language.vehicle_no, field: 'vehicle_number' },  
      { title: language.trip_cost_driver_share, field: 'driver_share'},
      { title: language.convenience_fee, field: 'convenience_fees'},
      { title: language.discount_ammount, field: 'discount'},      
      { title: language.Customer_paid, field: 'customer_paid'},
      { title: language.payment_mode, field: 'payment_mode'},
      { title: language.payment_gateway, field: 'gateway'},
      { title: language.cash_payment_amount, field: 'cashPaymentAmount'},
      { title: language.card_payment_amount, field: 'cardPaymentAmount'},
      { title: language.wallet_payment_amount, field: 'usedWalletMoney'}
  ];
  const [data, setData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState('');
  const bookinglistdata = useSelector(state => state.bookinglistdata);

  useEffect(()=>{
        if(bookinglistdata.bookings){
            setData(bookinglistdata.bookings);
        }else{
          setData([]);
        }
  },[bookinglistdata.bookings]);

  useEffect(() => {
    if(auth.info && auth.info.profile){
      setRole(auth.info.profile.usertype);
    }
  }, [auth.info]);

  const onConfirmClose=(value)=>{
    if(value){
      dispatch(cancelBooking({
        reason:value,
        booking:selectedBooking
      }));
    }
    setOpenConfirm(false);
  }
  
  return (
    bookinglistdata.loading? <CircularLoading/>:
    <div>
    <MaterialTable
      title={language.booking_title}
      columns={columns}
      data={data}
      options={{
        actionsColumnIndex: -1
      }}
      actions={[
        rowData => ({
          icon: 'cancel',
          tooltip: language.cancel_booking,
          disabled: rowData.status==='NEW' || rowData.status==='ACCEPTED'? false:true,
          onClick: (event, rowData) => {
            if(features.AllowCriticalEditsAdmin && (role==='rider' || role ==='admin')){
              setSelectedBooking(rowData);
              setOpenConfirm(true);
            }else{
              alert(language.demo_mode);
            }
          }         
        }),
      ]}
    />
    <ConfirmationDialogRaw
      open={openConfirm}
      onClose={onConfirmClose}
      value={''}
    />
    </div>

  );
}

export default BookingHistory;
