

export function date2StringYyyymmdd(dt, dd){
  console.debug(`changeString=${dt}`);
  console.debug(typeof(dt));
  if (dt === undefined || dt === null){
      return dt;
  }
  if (dd === undefined){
      return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDay()).slice(-2);
  }
  return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dd).slice(-2);
}
