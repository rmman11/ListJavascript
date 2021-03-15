function currentDate() {
	var Digital=new Date()
    var hours=Digital.getHours()     // Preia ora
    var minutes=Digital.getMinutes()     // Preia minutele
    var seconds=Digital.getSeconds()     // Preia secundele
    var day = Digital.getDate();
    var month = Digital.getMonth() + 1;
    var monthName;
    var year = Digital.getFullYear();

          var dn="AM"
  // Stabileste afisarea AM (Ante Meridian) sau PM (Post Meridian)
  if (hours>12) {
  	dn="PM"
  	hours=hours-12
  }
  if (hours==0)
  	hours=12
  if (minutes<=9)
  	minutes="0"+minutes
  if (seconds<=9)
  	seconds="0"+seconds



  switch (month)
  {
  	case 1:
  	monthName = "January";
  	break;
  	case 2:
  	monthName = "February";
  	break;
  	case 3:
  	monthName = "March";
  	break;
  	case 4:
  	monthName = "April";
  	break;
  	case 5:
  	monthName = "May";
  	break;
  	case 6:
  	monthName = "June";
  	break;
  	case 7:
  	monthName = "July";
  	break;
  	case 8:
  	monthName = "August";
  	break;
  	case 9:
  	monthName = "September";
  	break;
  	case 10:
  	monthName = "October";
  	break;
  	case 11:
  	monthName = "November";
  	break;
  	case 12:
  	monthName = "December";
  	break;
  }





// Aici poti schimba marimea si tipul fontului
// Creaza si afiseaza elementele HTML in eticheta <div>
let  myclock="<font size='4' face='Arial' ><b><br>"+hours+":"+minutes+":"
+seconds+" "+dn+"</b></font>";

let date2 = "<font size='4' face='Arial' ><b>Ne aflam in data de  " + day +  
" - " + monthName + " - " + year + "</b></font>";

//afisarea rezultaului din functie
document.getElementById("date").innerHTML="Ora exacta este " + myclock  + "<br />" +date2;
  setTimeout("ceas()",500)     // Executa functia ceas() la fiecare secunda
}

window.onload = currentDate;  //apelarea functie
