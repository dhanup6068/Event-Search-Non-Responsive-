
async function submit1(event) {
    console.log("submit begin")
    event.preventDefault();
    var clearf1 = document.getElementById("events")
    clearf1.style.display ='none';
    var clearf2 = document.getElementById("eventname")
    clearf2.innerHTML = "";
    var clearf3 = document.getElementById("seatmap")
    clearf3.innerHTML = "";
    var clearf4 = document.getElementById("eventdetails")
    clearf4.innerHTML = "";
    var clearf5= document.getElementById("Venueaddress");
    clearf5.style.display ='none';
    var clear8= document.getElementById("venue1");
    clear8.innerHTML=""
    var clear9= document.getElementById("venue2");
    clear9.innerHTML=""
    var clear10= document.getElementById("venuename");
    clear10.innerHTML=""
    var clearf6 = document.getElementById("venuedetails");
    clearf6.innerHTML ="";
    var clearf11 = document.getElementById("arrow");
    clearf11.innerHTML ="";
    var clearf7 = document.getElementById("no-records-found")
    clearf7.innerHTML='';
    

    var keyword1= document.getElementById("kword").value;
    var dist=document.getElementById("dist").value;
    var category=document.getElementById("category").value;
    var location=document.getElementById("loc").value;
    console.log(keyword1+dist+category+location);
    console.log(document.getElementById('location').checked)

    
    if(dist===""){
        dist=10;
    }

    if (document.getElementById('location').checked) {
      var url='https://ipinfo.io/json?token=db01fc49e336ca'
      const response = await fetch(url);
      const jsonData = await response.json();
      console.log(jsonData)
      let latlong = jsonData.loc
      const myArray = latlong.split(",");
      let lat=myArray[0]
      let long=myArray[1]
      
      getUrl(keyword1,dist,category,location,lat,long)  
      
    }
    
    else {

      var address = document.getElementById("loc").value;
      console.log(address)
      var url='https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=apikey';

      const response = await fetch(url);
      const jsonData = await response.json();
      
      if(jsonData.results[0]===undefined){
        var clearf1 = document.getElementById("tableData")
        clearf1.innerHTML = "";
        var clearf45 = document.getElementById("tableData")
        clearf45.style.display ='none';
        var clear = document.getElementById("no-records-found")
        clear.innerHTML = "";
        var norecfounds = document.getElementById("no-records-found");
    
        norecfounds.innerHTML += `<h3><p align="center" style='color:red; background-color:white;width: 1200px; padding:10px;'>No Records found</p><h3>`;   
      }
      else
      {
          let latlong = jsonData.results[0].geometry.location;
          let arr=Object.values(latlong)
          let lat=arr[0]
          let long=arr[1]

          getUrl(keyword1,dist,category,location,lat,long)
      }
    }

  }

async function getUrl(keyword1,dist,category,location,lat,long)
{
  var urlflask='/data?keyword1='+keyword1+'&dist='+dist+'&category='+category+'&location='+location+'&lat='+lat+'&long='+long
  const responseFlask = await fetch(urlflask);
  const jsonurl = await responseFlask.json();
  getTable(jsonurl)
  
}

async function getTable(jsonurl)
{
  var clearf7 = document.getElementById("no-records-found")
  clearf7.innerHTML="";
  var clearf45 = document.getElementById("tableData")
  clearf45.style.display ='none';
  var clearf1 = document.getElementById("tableData")
  clearf1.innerHTML = "";

  if(jsonurl.hasOwnProperty('_embedded'))
  {
  let lengthEntries=jsonurl._embedded.events.length

    eventtable=[]

      for (let i = 0; i < lengthEntries; i++) 
      {
          var name=jsonurl._embedded.events[i].name
          console.log(name)
          var eventId=jsonurl._embedded.events[i].id
          console.log(eventId)

          var date1=""
          if(jsonurl._embedded.events[i].dates.start.localDate!=undefined)
          {
            var localDate=jsonurl._embedded.events[i].dates.start.localDate
            date1=`${date1}${localDate} `
          }
      
          if(jsonurl._embedded.events[i].dates.start.localTime!=undefined)
          {
            var localTime=jsonurl._embedded.events[i].dates.start.localTime
            date1=`${date1}${localTime}`
          }
       
          var venueName=jsonurl._embedded.events[i]._embedded.venues[0].name
          console.log(venueName)
          var url=jsonurl._embedded.events[i].images[0].url
          console.log(url)
          var segmentName=jsonurl._embedded.events[i].classifications[0].segment.name
          console.log(segmentName)
          
          eventtable.push({"date":date1,"icon":url,"eventname":name,"genre":segmentName,"venue":venueName,"eventid":eventId})
      }
      buildTable(eventtable)
  }
  else
  {
    //document.getElementById("no-records-found").style.display = 'block';
    var clear = document.getElementById("no-records-found")
    clear.innerHTML = "";
    var norecfounds = document.getElementById("no-records-found");

    norecfounds.innerHTML += `<h3><p align="center" style='color:red; background-color:white;width: 1200px; padding:10px;'>No Records found</p><h3>`;

  }

}


order={"event":0,"genre":0,"venue":0}
async function sortTableevent()
{
if(order.event===0){
  eventtable=eventtable.sort((a,b) => a["eventname"]<b["eventname"] ? 1 : -1)
  buildTable(eventtable)
  order.event=1
  
}
else{
  eventtable=eventtable.sort((a,b) => a["eventname"]>b["eventname"] ? 1 : -1)
  buildTable(eventtable)
  order.event=0
}
console.log(order.event)
}

async function sortTablegenre()
{
  if(order.genre===0){
    eventtable=eventtable.sort((a,b) => a["genre"]<b["genre"] ? 1 : -1)
    buildTable(eventtable)
    order.genre=1
    
  }
  else{
    eventtable=eventtable.sort((a,b) => a["genre"]>b["genre"] ? 1 : -1)
    buildTable(eventtable)
    order.genre=0
  }
console.log(order.genre)
}

async function sortTablevenue()
{
  if(order.venue===0){
    eventtable=eventtable.sort((a,b) => a["venue"]<b["venue"] ? 1 : -1)
    buildTable(eventtable)
    order.venue=1
  }
  else{
    eventtable=eventtable.sort((a,b) => a["venue"]>b["venue"] ? 1 : -1)
    buildTable(eventtable)
    order.venue=0
  }
console.log(order.venue)
}

async function buildTable(eventtable)
{
  var table=document.getElementById("tableData");
  //table.style.tableLayout='fixed';

  table.innerHTML=`<tr><td><b>Date<b></td>
                    <td><b>Icon<b></td>
                    <td onclick="sortTableevent()" ><b>Event<b></td>
                    <td onclick="sortTablegenre()"><b>Genre<b></td>
                    <td onclick="sortTablevenue()"><b>Venue<b></td></tr>`
  for(var i=0;i<eventtable.length;i++){
  // console.log(date)
  var row = table.insertRow(1);
  
  var date2=eventtable[i].date.split(" ");
  row.insertCell(0).innerHTML= date2[0]+"<br>"+date2[1];;
  // +"<br>"+eventable[i].date[1];
  row.insertCell(1).innerHTML= "<img src="+eventtable[i].icon+" height=50 width=80></img>";
  row.insertCell(2).innerHTML=`<button style=" border:none; background:none ;cursor:pointer;" onMouseOver="this.style.color='blue'" onMouseOut="this.style.color='black'"
  onclick='getEventDetails("${eventtable[i].eventid}")'>${eventtable[i].eventname}</button>`;
  row.insertCell(3).innerHTML= eventtable[i].genre;
  row.insertCell(4).innerHTML= eventtable[i].venue;}

  var mytable = document.getElementById("tableData");
      mytable.setAttribute("style", "border:1px solid black;border-collapse: collapse;background-color:white;width:1200px;");

      const cells = mytable.getElementsByTagName('td');

      for (const cell of cells) {
        cell.setAttribute("style", "border:1px solid black; padding: 10px; border-collapse: collapse;background-color:white; text-align: center");
      }

}


function reset1() {
  var clearf45 = document.getElementById("tableData")
  clearf45.style.display ='none';
  var clearf6 = document.getElementById("tableData")
  clearf6.innerHTML = "";
  var clearf7 = document.getElementById("no-records-found")
  clearf7.innerHTML= "";
  var clearf8 = document.getElementById("events")
  clearf8.style.display ='none';
  var clearf1 = document.getElementById("eventname")
  clearf1.innerHTML = "";
  var clearf2 = document.getElementById("seatmap")
  clearf2.innerHTML = "";
  var clearf3 = document.getElementById("eventdetails")
  clearf3.innerHTML = "";
  var clearf5 = document.getElementById("venuedetails");
  clearf5.innerHTML = "";
  var clearf12 = document.getElementById("arrow");
  clearf12.innerHTML = "";
  var clearf8 = document.getElementById("Venueaddress")
  clearf8.style.display ='none';
  var clear9= document.getElementById("venue1");
  clear9.innerHTML="";
  var clear10= document.getElementById("venue2");
  clear10.innerHTML="";
  var clear11= document.getElementById("venuename");
  clear11.innerHTML=""

    document.getElementById("kword").value='';
    document.getElementById("dist").value='';
    document.getElementById("category").value='';
    document.getElementById("loc").value='';
    
}

function getLatLon() {
  var text = document.getElementById("loc");

  if (document.getElementById('location').checked) {
    text.style.display = 'none';
    text.removeAttribute("required");
    text.value="";
  } 
  else {
    text.style.display = 'block';
    text.setAttribute('required', '');
  }
}
venueNamejson={'venue':""}
async function getEventDetails(eventId)
{
  var clearf1 = document.getElementById("eventname")
  clearf1.innerHTML = "";
  var clearf2 = document.getElementById("seatmap")
  clearf2.innerHTML = "";
  var clearf3 = document.getElementById("eventdetails")
  clearf3.innerHTML = "";
  var clearf6 = document.getElementById("Venueaddress")
  clearf6.style.display ='none';
  // var clearf4 = document.getElementById("Venueaddress");
  // clearf4.innerHTML ="";
  var clear6= document.getElementById("venue1");
  clear6.innerHTML="";
  var clear7= document.getElementById("venue2");
  clear7.innerHTML="";
  var clear10= document.getElementById("venuename");
  clear10.innerHTML=""
  var clearf5 = document.getElementById("venuedetails");
  clearf5.innerHTML ="";
  var clearf10 = document.getElementById("arrow");
  clearf10.innerHTML ="";

  var urlflask='/event?eventId='+eventId
  const responseFlask = await fetch(urlflask);
  const jsonurl = await responseFlask.json();
  console.log(jsonurl)

  var eventDetails=document.getElementById("eventdetails");

  //name of the event
  if(jsonurl.hasOwnProperty('name')){
      var name=jsonurl.name
      var eventName=document.getElementById("eventname");
      // var element1 = document.createElement("h1");
      // element1.innerHTML = "<p style='padding-top:15px;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>"+name+"</p>"
      // eventName.appendChild(element1);
      eventName.innerHTML = "<p style='padding-top:15px;font-family: Verdana, Geneva, Tahoma, sans-serif;font-size:35px'>"+name+"</p>"

  }
  
  // date of the event
  var date=""
  if(jsonurl.hasOwnProperty('dates')){
    if(jsonurl.dates.hasOwnProperty('start')){
      if(jsonurl.dates.start.hasOwnProperty('localDate')){
        if(jsonurl.dates.start.localDate!='undefined' && jsonurl.dates.start.localDate!='Undefined')
        {
          var localDate=jsonurl.dates.start.localDate
          date=`${date}${localDate} `
        }
      }
    }
  }

  // time of the event
  if(jsonurl.hasOwnProperty('dates')){
    if(jsonurl.dates.hasOwnProperty('start')){
      if(jsonurl.dates.start.hasOwnProperty('localTime')){
        if(jsonurl.dates.start.localTime!='undefined' && jsonurl.dates.start.localTime!='Undefined')
        {
          var localTime=jsonurl.dates.start.localTime
          date=`${date}${localTime}`
        }
      }
    }
  }
  
  if (date!='')
  {
    //var ele1 = document.createElement("h3");
    eventDetails.innerHTML += "<span style='color:aqua;text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Date</span><br>";
    //eventDetails.appendChild(ele1);  

    //var ele2 = document.createElement("p");
    eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+date+"</span><br><br>"
    //eventDetails.appendChild(ele2);
    // eventDetails.innerHTML += "<p style='color:aqua;float: left;'>Date</p><br>";
    // eventDetails.innerHTML += "<p style='float: left;'>"+date+"</p><br>";

  }

  //artists of the event
  if(jsonurl._embedded.hasOwnProperty('attractions'))
  {   
      var artistarr = new Array();
      var links= new Array();
      for (var i=0;i<jsonurl._embedded.attractions.length; i++){
        var artist = jsonurl._embedded.attractions[i].name;
        var artistLink = jsonurl._embedded.attractions[i].url;
        artistarr.push(artist);
        links.push(artistLink);
      }

      //var ele3 = document.createElement("h3");
      eventDetails.innerHTML += "<span style='color:aqua;text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Artist/Team</span><br>";
      //eventDetails.appendChild(ele3);
      // eventDetails.innerHTML += "<p style='color:aqua;float: left;'>Artist/Team</p><br>";


      var ele4 = document.createElement("span");
      for(var i=0;i<artistarr.length;i++)
      {
        ele4.innerHTML +="<a style='text-decoration:none;color:#24a1bd;float:left;padding-right:5px;font-family: Verdana, Geneva, Tahoma, sans-serif;' href="+links[i]+" target='_blank'>"+artistarr[i]+"</a>";
        if(i!==artistarr.length-1){
          ele4.innerHTML += `<span style="float:left;"> | </span>`;
        } 
      }
      ele4.innerHTML += "<br><br>"
      eventDetails.appendChild(ele4);
  } 

  //venue name of the event
  if(jsonurl.hasOwnProperty('_embedded')){
    if(jsonurl._embedded.hasOwnProperty('venues')){
      if(jsonurl._embedded.venues[0].hasOwnProperty('name')){
        if(jsonurl._embedded.venues[0].name!='undefined' && jsonurl._embedded.venues[0].name!='Undefined')
          {
              venueNamejson.venue=jsonurl._embedded.venues[0].name
              //var ele5 = document.createElement("h3");
              eventDetails.innerHTML += "<span style='color:aqua;text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Venue<span><br>";
              //eventDetails.appendChild(ele5);

              //var ele6 = document.createElement("p");
              eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+venueNamejson.venue+"</span><br><br>";
              //eventDetails.appendChild(ele6);

              // eventDetails.innerHTML += "<p style='color:aqua;float: left;'>Venue</p><br>";
              // eventDetails.innerHTML += "<p style='float: left;'>"+venueName+"</p><br>";
          }
        }
      }
  }
  //Genre classifications of the event
  var genreJoined=""
  if(jsonurl.hasOwnProperty('classifications')){
    if(jsonurl.classifications[0].hasOwnProperty('subGenre')){
      if(jsonurl.classifications[0].subGenre.name!="undefined" && jsonurl.classifications[0].subGenre.name!="Undefined")
      {
        var subGenre=jsonurl.classifications[0].subGenre.name
        genreJoined=`${genreJoined}${subGenre} | `
      }
    }
    if(jsonurl.classifications[0].hasOwnProperty('genre')){
      if(jsonurl.classifications[0].genre.name!="undefined" && jsonurl.classifications[0].genre.name!="Undefined")
      {
        var genre=jsonurl.classifications[0].genre.name
        genreJoined=`${genreJoined}${genre} | `
      }
    }
    if(jsonurl.classifications[0].hasOwnProperty('segment')){
      if(jsonurl.classifications[0].segment.name!="undefined" && jsonurl.classifications[0].segment.name!="Undefined")
      {
        var segment=jsonurl.classifications[0].segment.name
        genreJoined=`${genreJoined}${segment} | `
      }
    }
    if(jsonurl.classifications[0].hasOwnProperty('subType')){
      if(jsonurl.classifications[0].subType.name!="undefined" && jsonurl.classifications[0].subType.name!="Undefined")
      {
        var subType=jsonurl.classifications[0].subType.name
        genreJoined=`${genreJoined}${subType} | `
      }
    }
    if(jsonurl.classifications[0].hasOwnProperty('type')){
      if(jsonurl.classifications[0].type.name!="undefined" && jsonurl.classifications[0].type.name!="Undefined")
      {
        var type=jsonurl.classifications[0].type.name
        genreJoined=`${genreJoined}${type}`
      }
    }
    
    //var ele7 = document.createElement("h3");
    eventDetails.innerHTML += "<span style='text-align:left; color:aqua;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Genre<span><br>";
    //eventDetails.appendChild(ele7);

    //var ele8 = document.createElement("p");
    eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+genreJoined+"</span><br><br>";
    //eventDetails.appendChild(ele8);
    // eventDetails.innerHTML += "<p style='float: left;' style='color:aqua;'>Genre</p><br>";
    // eventDetails.innerHTML += "<p style='float: left;'>"+genreJoined+"</p><br>";


  }
  
  //Price ranges of the event
  var priceRanges=""
  if(jsonurl.hasOwnProperty('priceRanges'))
  {
    if(jsonurl.priceRanges[0].hasOwnProperty('min'))
    {
      var min=jsonurl.priceRanges[0].min
      priceRanges=`${priceRanges}${min}`
    }
  }

  if(jsonurl.hasOwnProperty('priceRanges'))
  {  
    if(jsonurl.priceRanges[0].hasOwnProperty('max'))
    {
      var max=jsonurl.priceRanges[0].max
      priceRanges=`${priceRanges}-${max}`
    }
  }
  
  if (priceRanges!="") {
    priceRanges=`${priceRanges} USD`
    //var ele13 = document.createElement("h3");
    eventDetails.innerHTML += "<span style='color:aqua;text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: lighter;'>Price Ranges<span><br>";
    //eventDetails.appendChild(ele13);

    //var ele14 = document.createElement("p");
    eventDetails.innerHTML +="<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+priceRanges+"</span><br><br>";
    //eventDetails.appendChild(ele14);

    // eventDetails.innerHTML += "<p style='color:aqua;float: left;'>Price Ranges</p><br>";
    // eventDetails.innerHTML += "<p style='float: left;'>"+priceRanges+"</p><br>";
    
  }

  //Ticket Status code 
  if(jsonurl.hasOwnProperty('dates')){
    if(jsonurl.dates.hasOwnProperty('status')){
      if(jsonurl.dates.status.hasOwnProperty('code')){
        if(jsonurl.dates.status.code!='undefined' || jsonurl.dates.status.code!='Undefined')
          {
             var statusCode=jsonurl.dates.status.code
            //var ele9 = document.createElement("h3");
            //ele9.style.marginBottom='0px';
            eventDetails.innerHTML += "<span style='color:aqua; text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Ticket Status<span><br>";
            //eventDetails.appendChild(ele9);
            // eventDetails.innerHTML += "<p style='color:aqua; float: left;'>Ticket Status</p><br>"

            
            if(statusCode== 'onsale'){
              // var ele10 = document.createElement("p");
              eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'><span style='background-color:green; line-height:3; border-radius:5px;padding:5px;'>On sale</span></span><br><br>";
              // eventDetails.appendChild(ele10);
              // eventDetails.innerHTML += "<p style='float: left;'><span style='background-color:green; line-height:3; border-radius:5px;'>"+statusCode+"</span></p><br>";
            }
            else if(statusCode== 'offsale'){
              //var ele10 = document.createElement("p");
              eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'><span style='background-color:red; line-height:3; border-radius:5px;padding:5px;'>Off sale</span></span><br><br>";
              //eventDetails.appendChild(ele10);
              // eventDetails.innerHTML += "<p style='float: left;'><span style='background-color:red; line-height:3; border-radius:5px;'>"+statusCode+"</span></p><br>";

            }
            else if(statusCode== 'cancelled'){
              //var ele10 = document.createElement("p");
              eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'><span style='background-color:black; line-height:3; border-radius:5px;padding:5px;'>Cancelled</span></span><br><br>";
             // eventDetails.appendChild(ele10);
              // eventDetails.innerHTML += "<p style='float: left;'><span style='background-color:black; line-height:3; border-radius:5px;'>"+statusCode+"</span></p><br>";

            }
            else if(statusCode== 'postponed'){
              //var ele10 = document.createElement("p");
              eventDetails.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'><span style='background-color:orange; line-height:3; border-radius:5px;padding:5px;'>Postponed</span></span><br><br>";
              //eventDetails.appendChild(ele10);
              // eventDetails.innerHTML += "<p style='float: left;'><span style='background-color:orange; line-height:3; border-radius:5px;'>"+statusCode+"</span></p><br>";

            }
            else if(statusCode== 'rescheduled'){
              var ele10 = document.createElement("p");
              ele10.innerHTML += "<span style='text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;'><span style='background-color:orange; line-height:3; border-radius:5px;padding:5px;'>Rescheduled</span></span><br><br>";
              eventDetails.appendChild(ele10);
              // eventDetails.innerHTML += "<p style='float: left;'><span style='background-color:orange; line-height:3; border-radius:5px;'>"+statusCode+"</span></p><br>";

            }
          }
      }
    }
  }

  //Ticket url 
  if(jsonurl.hasOwnProperty('url'))
  { 
    if(jsonurl.url!='undefined'|| jsonurl.url!='Undefined')
      {
        var ticket=jsonurl.url

        //var ele11 = document.createElement("h3");
        //ele11.style.marginTop="0px"
        eventDetails.innerHTML += "<span style='color:aqua;text-align:left;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight: lighter;'>Buy Ticket At:<span><br>";
        //eventDetails.appendChild(ele11);

        //var ele12 = document.createElement("p");
        eventDetails.innerHTML += "<span><a href="+ticket+" style='text-decoration:none;color:#24a1bd;float :left;font-family: Verdana, Geneva, Tahoma, sans-serif;' target=_blank>Ticketmaster</a></span><br>";
        //eventDetails.appendChild(ele12);
        // eventDetails.innerHTML += "<p style='color:aqua; float: left;'>Buy Ticket At:</p><br>"
        // eventDetails.innerHTML += "<a href="+ticket+" style='text-decoration:none;color:#24a1bd;float: left;' target=_blank>Ticketmaster</a><br>";

      }

  }

  //Seatmap of the event
  if(jsonurl.hasOwnProperty('seatmap')){
    if(jsonurl.seatmap.hasOwnProperty('staticUrl')){
      if(jsonurl.seatmap.staticUrl!="undefined" || jsonurl.seatmap.staticUrl!="Undefined")
       var seatmap=jsonurl.seatmap.staticUrl
       var seatMap = document.getElementById("seatmap");
       seatMap.style.paddingRight='25px'
       var element = document.createElement("p");
       element.innerHTML = "<img src="+seatmap+" height=400 width=400 ></img>";
       seatMap.appendChild(element);
    }
  }

  var event=document.getElementById("venuedetails");
  event.innerHTML += `<p style='color:grey;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight:normal;font-size:20px;'>Show Venue Details</p>`;
  //event.innerHTML += `<i class="fa fa-angle-down fa_custom fa-3x" style='color:grey;cursor:pointer' onMouseOver="this.style.color='white'" onMouseOut="this.style.color='grey'" onclick="getVenueDetails()"></i>`;
  var arrow=document.getElementById("arrow");
  arrow.style.position='relative';
  arrow.style.top='-5px';
  arrow.style.content='""';
  arrow.style.display='inline-block';
  arrow.style.width='15px';
  arrow.style.height='15px';
  arrow.style.borderRight='0.2em solid grey';
  arrow.style.borderTop='0.2em solid grey';
  arrow.style.transform='rotate(135deg)';
  arrow.style.marginRight='0.5em';
  arrow.style.marginLeft='1.0em';
  arrow.style.cursor='pointer';
  arrow.setAttribute("onclick", "getVenueDetails()")
  arrow.setAttribute("onMouseOver", "this.style.borderTop='0.3em solid white'; this.style.borderRight='0.3em solid white';")
  arrow.setAttribute("onMouseOut", "this.style.borderTop='0.2em solid grey'; this.style.borderRight='0.2em solid grey'")
 
  // event.innerHTML += `<p style='color:grey;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight:normal;font-size:20px;'>Show Venue Details</p>`;

  event.scrollIntoView({behavior:'smooth'});
 
  var events = document.getElementById("events");
  events.setAttribute("style", "background-color: rgba(255, 255, 255, .15); backdrop-filter: blur(8px); width: 900px; height:600px; border-radius:15px; color:white;padding-left:25px;");

}


async function getVenueDetails()
{
  // var clearf1 = document.getElementById("Venueaddress")
  // clearf1.style.display ='none';
  var clear234 = document.getElementById("venue1")
  clear234.style.display ='none';
  var clear11 = document.getElementById("venue2")
  clear11.style.display ='none';
  var clear243 = document.getElementById("venuename")
  clear243.style.display ='none';
  var clearf1 = document.getElementById("venue1")
  clearf1.innerHTML ="";
  var clearf2 = document.getElementById("venue2")
  clearf2.innerHTML ="";
  var clear10= document.getElementById("venuename");
  clear10.innerHTML=""
  var clear34 = document.getElementById("venuedetails");
  clear34.innerHTML ="";
  var clear53 = document.getElementById("arrow");
  clear53.style.borderTop ='none';
  clear53.style.borderRight ='none';
  clear53.removeAttribute('onMouseOver');
  clear53.removeAttribute('onMouseOut');
  var clearf3 = document.getElementById("venue1");
  clearf3.innerHTML ="";
  var clearf4 = document.getElementById("venue2");
  clearf4.innerHTML ="";
  var clear99= document.getElementById("venuename");
  clear99.innerHTML="";
  

  var urlflask='/venue?venueName='+venueNamejson.venue
  const responseFlask = await fetch(urlflask);
  const jsonurl = await responseFlask.json();
  console.log(jsonurl)

  if(jsonurl.hasOwnProperty('_embedded')){
  var clear26  = document.getElementById("Venueaddress");
  clear26.style.display ='block';
  var clear22  = document.getElementById("venue1");
  clear22.style.display ='block';
  var clear33  = document.getElementById("venue2");
  clear33.style.display ='block';
  var clear77= document.getElementById("venuename");
  clear77.style.display ='block';
  
  var venueName=jsonurl._embedded.venues[0].name
  console.log(venueName)
  var url=jsonurl._embedded.venues[0].url
  console.log(url)
  var postalCode=jsonurl._embedded.venues[0].postalCode
  console.log(postalCode)
  var address=jsonurl._embedded.venues[0].address.line1
  console.log(address)
  var city=jsonurl._embedded.venues[0].city.name
  console.log(city)
  var stateCode=jsonurl._embedded.venues[0].state.stateCode
  console.log(stateCode)
  const city_code = `${city}, ${stateCode}`;

  if(jsonurl._embedded.venues[0].hasOwnProperty('images'))
  {
    if(jsonurl._embedded.venues[0].images[0].hasOwnProperty('url'))
   {
    var image=jsonurl._embedded.venues[0].images[0].url
    var venuename = document.getElementById("venuename");
     venuename.innerHTML+="<h2 style='text-align: center;margin-top:10px;text-decoration: underline;font-family: Verdana, Geneva, Tahoma, sans-serif;margin-bottom:5px;font-weight:normal;'>&nbsp;"+venueName+"&nbsp</h2>"
     venuename.innerHTML += "<img src="+image+" height=70 width=70 style='margin-bottom: 20px;'></img>";

     var venue1 = document.getElementById("venue1");
     venue1.setAttribute("style", 'border-right: 1px solid black;height: 120px;position:absolute;width:450px;margin-top:-40px');
     venue1.innerHTML += "<p style='text-align: left;padding-left:60px;margin-bottom:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>Address : "+address+" <p style='text-align: left;padding-left:140px;margin-bottom:0px;margin-top:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+city_code+"</p><p style='text-align: left;padding-left:140px;margin-top:0px;margin-bottom:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+postalCode+"</p></p>";
     venue1.innerHTML += "<a style='float: left;text-decoration:none; color:#24a1bd; margin-bottom:15px; padding-left:130px;font-family: Verdana, Geneva, Tahoma, sans-serif;' href=https://www.google.com/maps/search/?api=1&query="+address+city_code+postalCode+" target=_blank>Open in google maps </a>"
  
     var venue2 = document.getElementById("venue2");
     venue2.setAttribute("style", 'margin-top:-30px;padding-left:450px');
     venue2.innerHTML += "<a style='text-decoration:none; color:#24a1bd;margin-bottom:10px;font-family: Verdana, Geneva, Tahoma, sans-serif;margin-top:-100px;' href="+url+" target=_blank>More events at this venue</a>";

     var venuecard = document.getElementById("Venueaddress");
     venuecard.scrollIntoView({behavior:'smooth'});
     venuecard.setAttribute("style", "background-color:white; width: 900px;height:270px; border-radius:25px ; outline: 1px solid black;outline-offset:-10px; padding-top: 10px;padding-bottom: 10px;"); 
   }
  }

  
  else
  {
  var venuename = document.getElementById("venuename");
  venuename.innerHTML+="<h2 style='text-align: center;margin-top:10px;text-decoration: underline;font-family: Verdana, Geneva, Tahoma, sans-serif;font-weight:normal;'>&nbsp;"+venueName+"&nbsp</h2>"

  var venue1 = document.getElementById("venue1");
  venue1.setAttribute("style", 'border-right: 1px solid black;height: 165px;position:absolute;width:450px;margin-top:-20px');
  venue1.innerHTML += "<p style='text-align: left;padding-left:100px;margin-bottom:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>Address : "+address+" <p style='text-align: left;padding-left:183px;margin-bottom:0px;margin-top:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+city_code+"</p><p style='text-align: left;padding-left:183px;margin-top:0px;margin-bottom:0px;font-family: Verdana, Geneva, Tahoma, sans-serif;'>"+postalCode+"</p></p>";
  venue1.innerHTML += "<a style='float: left;text-decoration:none; color:#24a1bd; margin-bottom:15px; padding-left:130px;font-family: Verdana, Geneva, Tahoma, sans-serif;' href=https://www.google.com/maps/search/?api=1&query="+address+city_code+postalCode+" target=_blank>Open in google maps </a>"
  
  var venue2 = document.getElementById("venue2");
  venue2.innerHTML += "<a style='text-decoration:none; color:#24a1bd;margin-bottom:10px;font-family: Verdana, Geneva, Tahoma, sans-serif;' href="+url+" target=_blank>More events at this venue</a>";

  var venuecard = document.getElementById("Venueaddress");
  venuecard.scrollIntoView({behavior:'smooth'});
  venuecard.setAttribute("style", "background-color:white; width: 900px;height:250px; border-radius:25px ; outline: 1px solid black;outline-offset:-10px; padding-top: 10px;padding-bottom: 10px;");   
  }
}

}
