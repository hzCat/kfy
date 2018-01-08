let turn = function(off) {
  let oLength = off.length;
  let arr = [];
  for (let i = 0; i < oLength; i++) {
    let obj = off[i];
    let newObj = {};
    if (obj.offerType == "STORE_OFFER") {
      newObj.color = "mark-purple-blue";
      newObj.oneWord = "特";
    } else if (obj.offerType == "FIRST_ORDER_REDUCE") {
      newObj.color = "mark-orange";
      newObj.oneWord = "首";
    } else if (obj.offerType == "PAY_REDUCE") {
      newObj.color = "mark-lightgreen";
      newObj.oneWord = "普";
    } else if (obj.offerType == "TEAM_PAY_REDUCE") {
      newObj.color = "mark-green";
      newObj.oneWord = "团";
    } else if (obj.offerType == "VIP_OFFER") {
      newObj.color = "mark-orange";
      newObj.oneWord = "个";
    } else if (obj.offerType == "ROUNDING_OFFER") {
      newObj.color = "mark-blue";
      newObj.oneWord = "特";
    } else if (obj.offerType == "OFFLINE_VOUCHER") {
      newObj.color = "mark-orange";
      newObj.oneWord = "券";
    } else if (obj.offerType == "ONLINE_VOUCHER") {
      newObj.color = "mark-orange";
      newObj.oneWord = "券";
    } else if (obj.offerType == "FULL_REDUCE") {
      newObj.color = "mark-red";
      newObj.oneWord = "减";
    }
    newObj.name = obj.offerTypeDisplayName;
    newObj.money = obj.offerAmt;
    arr.push(newObj);
  }
  return arr;
};

module.exports = {
  turn: turn
};
