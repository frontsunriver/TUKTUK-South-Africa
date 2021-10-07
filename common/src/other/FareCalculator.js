export function FareCalculator(distance,time,rateDetails){   
    let baseCalculated =  (parseFloat(rateDetails.rate_per_unit_distance) * parseFloat(distance)) + (parseFloat(rateDetails.rate_per_hour) * (parseFloat(time) / 3600));
    if(rateDetails.base_fare>0){
        baseCalculated = baseCalculated + rateDetails.base_fare;
    }
    let total = baseCalculated > parseFloat(rateDetails.min_fare) ? baseCalculated : parseFloat(rateDetails.min_fare);
    let convenienceFee = 0;
    if(rateDetails.convenience_fee_type && rateDetails.convenience_fee_type == 'flat'){
        convenienceFee = rateDetails.convenience_fees;
    }else{
        convenienceFee = (total*parseFloat(rateDetails.convenience_fees)/100);
    }
    let tukTukFee = 0;
    if(rateDetails.convenience_fee_type && rateDetails.convenience_fee_type == 'flat'){
        tukTukFee = rateDetails.tuktuk_fees;
    }else{
        tukTukFee = (total*parseFloat(rateDetails.tuktuk_fees)/100);
    }
    let fleetManagerFee = 0;
    if(rateDetails.convenience_fee_type && rateDetails.convenience_fee_type == 'flat'){
        fleetManagerFee = rateDetails.fleet_manager_fees;
    }else{
        fleetManagerFee = (total*parseFloat(rateDetails.fleet_manager_fees)/100);
    }
    let insuranceFee = 0;
        insuranceFee = rateDetails.insurance_road_fees;
    let grand = total + insuranceFee;
        
    return {
        totalCost:parseFloat(total.toFixed(2)),
        grandTotal:parseFloat(grand.toFixed(2)),
        convenience_fees:parseFloat(convenienceFee.toFixed(2)),
        tuktuk_fees:parseFloat(tukTukFee.toFixed(2)),
        fleet_manager_fees:parseFloat(fleetManagerFee.toFixed(2)),
        insurance_road_fees:parseFloat(insuranceFee.toFixed(2)),
    }
}
