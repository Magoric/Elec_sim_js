
function main()
{
 var canvas = document.getElementById('myCanvas');
 contexto = canvas.getContext('2d');
 ChipUserControl.init();
 
  var linea=[];

  //chips:
  var power=new e_power(200,50);
  var timer=new e_timer05(250,100);
  var led=new e_red_led(200,150);
  var ls7400=new e_7400(350,200);
  var led2=new e_red_led(200,200);
  var switch1=new e_switch(350,20,true);
  var switch2=new e_switch(350,100,true);  

  //To add lines to connect the pins of the chips:
  
  var x=0;
  
  //Vcc:
  linea[x]=new line();
  linea[x].add_pin(power.pin[1]);
  linea[x].add_pin(switch1.pin[1]);
  x++;
  
  //Ground:
  linea[x]=new line();
  linea[x].add_pin(power.pin[2]);
  linea[x].add_pin(led.pin[2]);
  linea[x].add_pin(timer.pin[2]);
  linea[x].add_pin(ls7400.pin[7]);
  linea[x].add_pin(led2.pin[2]);
  x++;
  
  linea[x]=new line();
  linea[x].add_pin(switch1.pin[2]);
  linea[x].add_pin(timer.pin[4]);
  linea[x].add_pin(switch2.pin[1]);
  x++;
  
  linea[x]=new line();
  linea[x].add_pin(switch2.pin[2])
  linea[x].add_pin(ls7400.pin[14]);
  x++;
  
  linea[x]=new line();
  linea[x].add_pin(timer.pin[1]);
  linea[x].add_pin(led.pin[1]);
  linea[x].add_pin(ls7400.pin[1]);
  linea[x].add_pin(ls7400.pin[2]);
  x++
  
  linea[x]=new line();
  linea[x].add_pin(led2.pin[1]);
  linea[x].add_pin(ls7400.pin[3]);
  
  //Draw lines:  
  for(x=0; x<linea.length; x++) linea[x].draw();
	
  //Switch on the power:	
  power.call_engine(); 
}
