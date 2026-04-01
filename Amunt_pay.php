
<h1><?php
$hour=50; //8*5=40
$rate=10;
$weekpay=0;
if($hour<=0){
    $weekpay=0;
}else if ($hour<=40){
    $weekpay=$hour*$rate;
}else {
    $weekpay=(40*$rate)+(($hour-40)*($rate*1.5));
}
echo "Your weekly payment is :-".$weekpay;
?></h1>