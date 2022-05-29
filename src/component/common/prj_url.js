
import axios from 'axios';
import {ServerUrl} from './prj_const';
import {date2StringYyyymmdd} from './prj_func';

//
// ログイン
export async function ApiAuth(userid, password){
  const body = {
    username : userid,
    password : password
  };
  return await axios.post(ServerUrl + "/api-auth/", body);
}

//
// グループサマリ全データ取得
export async function ApiGetDepositSumaryList(user, nRunApiCount = 1, page = 1){
  let urlpath = ServerUrl + "/api/deposit_groupsumary_list/?no_page";
  return await axios.get(urlpath, {headers : user.Authorization});
}

/**
 * 預金・資産項目取得関数
 * @param {*} user 
 * @param {*} deposit_flag true:=預金項目, false:=資産項目
 * @returns 
 */
export async function ApiGetDepositItemList(user, deposit_flag){
  const url = `/api/deposit_item_list/?no_page&deposit_flag=${deposit_flag}`;
  return await axios.get(ServerUrl + url, {headers : user.Authorization});
}

export async function ApiUpdateDeposit(deposit_key, data, user){
  console.debug("/api/deposit/--------------------------");
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = ServerUrl + "/api";
  return await axios.patch(ServerUrl + "/api/deposit/" + deposit_key + "/", data);
}

export async function ApiGetDepositItem(user){
  return await axios.get(ServerUrl + "/api/deposit_item/", {headers : user.Authorization});
}

//
// グラフ用データ取得
export async function ApiGetDepositItemDataSumaryList(user, graphSearch){
  let headers = {
    headers : user.Authorization
  };
  let parameters = "";  
  graphSearch.select_items.map(depositItem_key =>{
    if (parameters !== ""){
      parameters += "&"
    }
    if (depositItem_key !== undefined){
      parameters += `depositItem_key=${depositItem_key}`
    }

  });
  console.debug("from_date");
  console.debug(graphSearch.select_fromto_date[0]);
  console.debug(typeof(graphSearch.select_fromto_date[0]));
  const from_date = date2StringYyyymmdd(graphSearch.select_fromto_date[0], undefined);
  const to_date = date2StringYyyymmdd(graphSearch.select_fromto_date[1], undefined);
  console.debug("from_date");
  console.debug(from_date);
  console.debug(typeof(from_date));
  if ((from_date !== undefined) && (from_date !== '') && (from_date !== null)){
    if (parameters !== ""){
      parameters += "&"
    }
    parameters += `insert_yyyymm_from=${from_date.substr(0,7)}`
  }
  if ((to_date !== undefined) && (to_date !== '') && (to_date !== null)){
    if (parameters !== ""){
      parameters += "&"
    }
    parameters += `insert_yyyymm_to=${to_date.substr(0,7)}`
  }
  let url = "/api/deposit_item_date_sumary_list/?no_page";
  if (parameters !== ""){
    url += "&" + parameters;
  }
  let urlpath = ServerUrl + url;
  console.debug(`urlpath=[${urlpath}]`);
  return await axios.get(urlpath, headers);
}

export async function ApiPostDeposit(user, data){
    //Post実行
    axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
    axios.defaults.baseURL = ServerUrl + "/api";
    return await axios.post(ServerUrl + "/api/deposit/", data );
}

export async function ApiPostDepositBatch(user, data){
    //Post実行
    axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
    axios.defaults.baseURL = ServerUrl + "/api";
    return await axios.post(ServerUrl + "/api/deposit_batch/", data)
}

//
// 複数データ取得時は、datasのみ追加して返す
export async function ApiGetSavingsList(user, urlParameters, urlPath){
  //
  // parameters : URLパラメータ (未設定の場合はURLを有効にする)
  // url: アクセスURLパス
  let path ="";
  if (urlParameters == null){
    path = urlPath;
  }else{
    path = ServerUrl + "/api/savings_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  if (path == null){
    console.debug(`No Axios`);
    return;
  }
  return await axios.get(path, headers);
}

//
// 合計額取得
export async function ApiGetSavingsTotal(user){
  let headers = {
    headers : user.Authorization
  };
  let urlpath = ServerUrl + "/api/savings_total/";
  return  await axios.get(urlpath, headers);
}

export async function ApiUpdateSavings(savings_key, data, user){
  console.debug("/api/savings/--------------------------");
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = ServerUrl + "/api";
  return await axios.patch(ServerUrl + "/api/savings/" + savings_key + "/", data)
}

//
// 契約グループ単位サマリー全データ取得
export async function ApiGetSavingSumaryList(user){
  let urlpath = ServerUrl + "/api/saving_sumary_list/?no_page";
  return await axios.get(urlpath, {headers : user.Authorization});
}

//
// 貯金計画データ登録
export async function ApiPostSavings(user, data){
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = ServerUrl + "/api";
  return await axios.post(ServerUrl + "/api/savings/", data);
}

export async function ApiGetDepositList(user, urlParameters, urlPath){
  //
  // parameters : URLパラメータ (未設定の場合はURLを有効にする)
  // url: アクセスURLパス
  let path ="";
  if (!urlParameters){
    path = urlPath;
  }else{
    path = ServerUrl + "/api/deposit_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  return await axios.get(path, headers);
}


//
// 全データ取得
export async function ApiGetItemSumaryList(user, urlParameters, urlPath){
  let path ="";
  if (!urlParameters){
    path = urlPath;
  }else{
    path = ServerUrl + "/api/deposit_sumary_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  return await axios.get(path, headers);
}

//
// 預金全データ取得
export async function ApiGetDepositTotal(user){
  let headers = {
    headers : user.Authorization
  };
  let urlpath = ServerUrl + "/api/deposit_total/";
  return await axios.get(urlpath, headers);
}

// 全データ取得
export async function ApiGetDepositDateSumaryList(user){
  let headers = {
    headers : user.Authorization
  };
  let urlpath = ServerUrl + "/api/deposit_date_sumary_list/?no_page";
  return await axios.get(urlpath, headers);
}

//資産トラン取得
export async function ApiGetAsstesPandas(user, assetSearch){
  let urlpath = ServerUrl + "/api/assets_pandas/?format=json";
  let headers = {
    headers : user.Authorization
  };
  const from_date = assetSearch.select_fromto_date[0];
  const to_date = assetSearch.select_fromto_date[1];

  console.debug("from_date");
  console.debug(from_date);
  console.debug("to_date");
  console.debug(to_date);
  if ((from_date !== undefined) && (from_date !== '') && (from_date !== null)){
    urlpath += `&insert_yyyymm_from=${from_date.substr(0,7)}`
  }
  if ((to_date !== undefined) && (to_date !== '') && (to_date !== null)){
    urlpath += `&insert_yyyymm_to=${to_date.substr(0,7)}`
  }
  return await axios.get(urlpath, headers);
}

//資産トラン登録
export async function ApiPostAssets(user, data){
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = ServerUrl + "/api";
  return await axios.post(ServerUrl + "/api/assets_bulk/", data);
}

//資産トラン更新
export async function ApiPutAssetsBulkUpdate(user, data){
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = ServerUrl + "/api";
  return await axios.put(ServerUrl + "/api/assets_bulk_update/", data);
}

//資産グループ・日付単位データ取得
export async function ApiGetAssetsGroupSumaryList(user, assetSearch){
  let urlpath = ServerUrl + "/api/assets_group_sumary_list/?no_page";
  let headers = {
    headers : user.Authorization
  };
  const from_date = assetSearch.select_fromto_date[0];
  const to_date = assetSearch.select_fromto_date[1];

  console.debug("from_date");
  console.debug(from_date);
  console.debug("to_date");
  console.debug(to_date);
  if ((from_date !== undefined) && (from_date !== '') && (from_date !== null)){
    urlpath += `&insert_yyyymm_from=${from_date.substr(0,7)}`
  }
  if ((to_date !== undefined) && (to_date !== '') && (to_date !== null)){
    urlpath += `&insert_yyyymm_to=${to_date.substr(0,7)}`
  }
  return await axios.get(urlpath, headers);

}
