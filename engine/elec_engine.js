ancho_pin=4;
alto_pin=4;
espacio_entre_pins=4;
ancho_chip=30;

var GROUND=-10000;
var contexto;

function draw_box(x,y,x1,y1)
{
contexto.beginPath();
contexto.moveTo(x,y);
contexto.lineTo(x1,y);
contexto.lineTo(x1,y1);
contexto.lineTo(x,y1);
contexto.lineTo(x,y);
contexto.stroke(); 	
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//*********************************** PIN ***********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

function pin(chip,x,y,num)
{
 this.type="e"; //Tipo: "e","s","es"
	
 this.num=num; //Numero del pin dentro del chip
 this.chip=chip; //Puntero al chip que lo contiene
 this.line=null; //Puntero a la linea a la que esta conectado. 
 
 this.px=x; //Posicion x absoluta en el canvas para dibujarlo 
 this.py=y; //Posicion y absoluta en el canvas para dibujarlo
} 


pin.prototype.draw=function()
{
 draw_box(this.px,this.py,this.px+ancho_pin,this.py+alto_pin);
 //contexto.fillText(this.num,this.px+10,this.py+10);
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//*********************************** PIN ***********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//*********************************** CHIP **********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

function chip(lbl,num_pins,x,y)
{
  this.pin=[]; //Array de los pins
  
  this.func_ctrl=null; //Funcion que controla el chip. 
  
  this.label=lbl; //Etiqueta
  this.pos_x=x; //Posicion x (esquina superior izq.) 
  this.pos_y=y; //Posicion y (esquina superior izq.) 
  this.num_pins=num_pins; //Numero de pins
  
  this.draw_label_type="ht"; //Como y donde coloca la etiqueta:
  							 //                 "ht" (horizontal top).
  							 //					"v" (vertical).

  this.engine=null; //funcion que gestiona el funcionamento interno del chip
  
  //Calculamos algunas cosas:
  var mitad_pins=Math.floor(this.num_pins/2); 
  var x,x1,k;
  var alto=mitad_pins*(alto_pin+espacio_entre_pins)+espacio_entre_pins*2;
  
  this.xf=this.pos_x+ancho_chip; //Posicion x (esquina inferior dcha.). 
  this.yf=this.pos_y+alto; //Posicion y (esquina inferior dcha.).
  
  this.xr=Math.floor(this.pos_x+(ancho_chip/2)); //Posicion x muesca chip
  this.yr=this.pos_y+Math.floor(alto_pin/2)+2; //Posicion y muesca chip
  
  //pins:
  for(x=1; x<=mitad_pins; x++)
   {
    //Pins del lado izquierdo:	 
    k=this.pos_y+(x*alto_pin)+((x)*espacio_entre_pins);	 
    this.pin[x]=new pin(this,this.pos_x-ancho_pin,k,x);
  
    //Pins del lado derecho:
    x1=mitad_pins+x;

    k=this.pos_y+(alto_pin+espacio_entre_pins)*(mitad_pins+1-x);
    
    this.pin[x1]=new pin(this,this.pos_x+ancho_chip,k,x1);
   }  
}

chip.prototype.set_pin_type=function(pin,type)
{
 if(type=="e" || type=="s" || type=="es") this.pin[pin].type=type;
}

chip.prototype.set_engine=function(engine)
{
 this.engine=engine;
}

chip.prototype.call_engine=function()
{	
 this.engine();
}

//Establece el voltaje en la linea en asociada al pin.
// pin: numero de pin
// volt: voltaje.
chip.prototype.set_volt=function(pin,volt)
{
 if(this.pin[pin].line!=null) this.pin[pin].line.set_volt(volt);
}

//Toma el voltaje en la linea en asociada al pin.
// pin: numero de pin. Si el pin no tiene linea asociada,
// devolverá 0;
chip.prototype.get_volt=function(pin)
{
 if(this.pin[pin].line==null) return 0;
 else return this.pin[pin].line.get_volt();

}

chip.prototype.draw=function()
{
 var x;
 
 //La caja:
 draw_box(this.pos_x,this.pos_y, this.xf,this.yf); 
 
 //la muesca:
 contexto.beginPath();
 contexto.arc(this.xr,this.yr,3,0,2*Math.PI);
 contexto.stroke(); 
 
 //La etiqueta:
 if(this.draw_label_type=="ht")
  {
   x=this.pos_x+(ancho_chip/2)-(contexto.measureText(this.label).width/2);  
   contexto.fillText(this.label,x,this.pos_y-2); 
  }
  
 if(this.draw_label_type=="v")
  {
   for(x=0; x<this.label.length; x++)
    {	 
     contexto.fillText(this.label[x],this.pos_x+(ancho_chip/2)-(contexto.measureText("X").width/2),this.pos_y+18+(x*8)); 
    }
  }
 
 //los pins:
 for(x=1; x<=this.num_pins; x++) this.pin[x].draw(); 	
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//*********************************** CHIP **********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//********************************** LINE **********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function line()
{
 this.ground=false; //Si tierra es true, no se tiene en cuenta el voltaje.
 this.volt=0; //Voltaje que lleva la linea en este instante. 
 this.pins=[]; //pins a los que esta conectada la linea.
}

line.prototype.add_pin=function(pin)
{
 var k=this.pins.length;
 this.pins[k]=pin; //puntero de la linea al pin.
 pin.line=this; //puntero del pin a la linea.
}

line.prototype.set_volt=function(volt)
{
 if(volt!=this.volt)
  {	 
   this.volt=volt;
   this.transmit();
  } 
}

line.prototype.get_volt=function()
{
 return this.volt;		
}

line.prototype.transmit=function()
{
 var x;
 var k=this.pins.length;
 
 if(k>0)
  {	 
   for(x=0; x<k; x++)
    {
     if(this.pins[x].type=="e" || this.pins[x].type=="es") this.pins[x].chip.engine();
    }
  }
  
 this.draw(); 
}

line.prototype.draw=function()
{
   var x;
   var np=this.pins.length;
   var color,c1;
   
   if(np>1)
    {
     color='#000000'
     if(this.volt<0 && this.volt!=GROUND) color='#FFFF00';     
     if(this.volt==GROUND) color='#0000FF'; //Si tierra: azul.
     if(this.volt>0 && this.volt<=5) //Si 0-5v: Rojo
      {
       x=Math.floor(this.volt*255/5); 
       color='#'+x.toString(16).toUpperCase()+'0000';
      }

     contexto.beginPath();
     
     contexto.moveTo(this.pins[0].px+ancho_pin/2,this.pins[0].py+alto_pin/2);
     for(x=1; x<np; x++)
      {
	   contexto.lineTo(this.pins[x].px+ancho_pin/2,this.pins[x].py+alto_pin/2); 	
      }
      
     c1=contexto.strokeStyle; 
     contexto.strokeStyle = color; 
     contexto.stroke();
     contexto.strokeStyle = c1;
    }
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//*********************************** LINE **********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
