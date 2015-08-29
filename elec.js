
function main()
{
  var canvas = document.getElementById('miCanvas');
  contexto = canvas.getContext('2d');
 
  var linea=[];

  //Creamos los chips:
  var power=new e_power(200,50);
  var timer=new e_timer05(250,100);
  var led=new e_red_led(200,150);
  var ls7400=new e_7400(250,200);
  var led2=new e_red_led(200,200);
  
  
  //Añadimos las lineas a los pines de los chips:
  
  //Vcc:
  linea[0]=new line();
  linea[0].add_pin(power.pin[1]);
  linea[0].add_pin(timer.pin[4]);
  linea[0].add_pin(ls7400.pin[14]);
  
  //Ground:
  linea[1]=new line();
  linea[1].add_pin(power.pin[2]);
  linea[1].add_pin(led.pin[2]);
  linea[1].add_pin(timer.pin[2]);
  linea[1].add_pin(ls7400.pin[7]);
  linea[1].add_pin(led2.pin[2]);

  
  linea[2]=new line();
  linea[2].add_pin(timer.pin[1]);
  linea[2].add_pin(led.pin[1]);
  linea[2].add_pin(ls7400.pin[1]);
  linea[2].add_pin(ls7400.pin[2]);
  
  linea[3]=new line();
  linea[3].add_pin(led2.pin[1]);
  linea[3].add_pin(ls7400.pin[3]);
  
  
  
  
  
  //Dibujamos las lineas:  
  for(var x=0; x<linea.length; x++) linea[x].draw();
	
  //Encendemos el interruptor:	
  power.call_engine(); 
}

