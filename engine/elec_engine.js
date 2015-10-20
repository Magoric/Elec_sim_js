pin_width=4;
pin_high=4;
space_between_pins=4;
chip_width=30;

var GROUND=-10000;
var contexto;

ChipUserControl=new TChipUserControl();

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
//**************************** TChipControl *********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

//Used to control the access to the chips by the mouse.
function TChipUserControl()
{
 this.chip=[];
 this.n=0;
}

TChipUserControl.prototype.init=function()
{
 this.canvas=contexto.canvas;
 this.canvas.addEventListener("mousedown", TChipUserControl_events, false);
}

TChipUserControl_events=function(event)
{
 var h,x,y;
 var p;
 
 var k=ChipUserControl;

 if(k.n>0)
  {	 
	 for(h=0; h<k.n; h++)
	  {
	   p=k.chip[h].get_squares_pos();
	   x=event.pageX-contexto.canvas.offsetLeft;
	   y=event.pageY-contexto.canvas.offsetTop;
	   
	   if(p[0]<=x && p[2]>=x)
		{   
		 if(p[1]<=y && p[3]>=y) k.chip[h].click();
		} 		
	  }	
  }
}

//Add a chip to control.
TChipUserControl.prototype.add_chip=function(chip)
{
 this.chip[this.n]=chip;
 this.n++;
}


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//**************************** TChipControl *********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//******************************** TTimer ***********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

//Used to get a particular timer.
//Time is expressed in 'ticks' and it increment one unit every 'ms' milliseconds.
function TTimer(ms)
{
 this.tick=-1;
 this.ms=ms;
 this.ttimer_id=null;
 
 //Action of the timer. Called automatically. Not for the user.
 this.play_timer=function()
  { 
   this.tick++;	
   this.ttimer_id=window.setTimeout(this.play_timer.bind(this), this.ms); 	
  } 
 
 this.play_timer();
}

//Return the actual tick's number.
TTimer.prototype.get_ticks=function()
{
 return this.tick;
}

//Set the timer's tick's number to 't'.   
TTimer.prototype.set_ticks=function(t)
{
 this.tick=t;	
}

//Set the timer's tick's number to zero.
TTimer.prototype.reset_ticks=function()
{
 this.tick=0;	
}

//Stop the timer. It not delete the intrinsic variables associated to the object.
TTimer.prototype.stop=function()
{
 window.clearTimeout(this.ttimer_id);
}

//Continue with the timer 'ticks' count.
TTimer.prototype.carryon=function()
{
 this.ttimer_id=window.setTimeout(this.play_timer.bind(this), this.ms);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//******************************** TTimer ***********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//*********************************** PIN ***********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

function pin(chip,x,y,num)
{
 this.type="i"; //Tipo: "i","o","io"
	
 this.num=num; //Pin number in the chip.
 this.chip=chip; //Pointer to the chip it belongs.
 this.line=null; //pointer to the line that connects it 
 
 this.px=x; //X position in the canvas to draw it 
 this.py=y; //Y position in the canvas to draw it
} 

//Pin draw function.
pin.prototype.draw=function()
{
 draw_box(this.px,this.py,this.px+pin_width,this.py+pin_high);
}

pin.prototype.get_x=function()
{
 return this.px;	
}

pin.prototype.get_y=function()
{
 return this.py;	
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//*********************************** PIN ***********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//*********************************** CHIP **********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

function chip(lbl,num_pins,x,y)
{
  this.pin=[]; //Pins Array
  
  //this.func_ctrl=null; //Function to control the chip. 
  
  this.label=lbl; //Label
  this.pos_x=x; //Position x (top-left corner.) 
  this.pos_y=y; //Position y (top-left corner.) 
  this.num_pins=num_pins; //Number of pins
  
  this.draw_label_type="ht"; //How and where to draw the label:
  							 //                 "ht" (horizontal top).
  							 //					"v" (vertical).

  this.engine=null; //Function to control the internal operations of the chip.
  
  //Calculating some things:
  var mitad_pins=Math.floor(this.num_pins/2); 
  var x,x1,k;
  var alto=mitad_pins*(pin_high+space_between_pins)+space_between_pins*2;
  
  this.xf=this.pos_x+chip_width; //Position x (bottom-right corner.). 
  this.yf=this.pos_y+alto; //Position y (bottom-right corner.).
  
  this.xr=Math.floor(this.pos_x+(chip_width/2)); //Position x chip's notch
  this.yr=this.pos_y+Math.floor(pin_high/2)+2; //Position y chip's notch
  
  //pins:
  for(x=1; x<=mitad_pins; x++)
   {
    //Left side pins:	 
    k=this.pos_y+(x*pin_high)+((x)*space_between_pins);	 
    this.pin[x]=new pin(this,this.pos_x-pin_width,k,x);
  
    //Right side pins:
    x1=mitad_pins+x;

    k=this.pos_y+(pin_high+space_between_pins)*(mitad_pins+1-x);
    
    this.pin[x1]=new pin(this,this.pos_x+chip_width,k,x1);
   }  
}
  
chip.prototype.no_power=function()
{
 var x;
 for(x=1; x<this.pin.length; x++)
  {
   if(this.pin[x].type=="o" || this.pin[x].type=="io") this.set_volt(x,0);
  }
}

chip.prototype.set_pin_type=function(pin,type)
{
 if(type=="i" || type=="o" || type=="io") this.pin[pin].type=type;
}

chip.prototype.set_engine=function(engine)
{
 this.engine=engine;
}

chip.prototype.call_engine=function()
{	
 this.engine();
}

//Put the voltage in the line associated to the pin.
// pin: pin's number
// volt: voltage.
chip.prototype.set_volt=function(pin,volt)
{
 if(this.pin[pin].line!=null) this.pin[pin].line.set_volt(volt);
}

//Get the voltage in the line associated to the pin.
// pin: pin's number. If the pin have not a line associated, will return 0.
chip.prototype.get_volt=function(pin)
{
 if(this.pin[pin].line==null) return 0;
 else return this.pin[pin].line.get_volt();
}

chip.prototype.draw=function()
{
 var x,c;
 
 c=contexto.strokeStyle;
 contexto.strokeStyle='black';
 
 //the box:
 draw_box(this.pos_x,this.pos_y,this.xf,this.yf); 
 
 //the notch:
 contexto.beginPath();
 contexto.arc(this.xr,this.yr,3,0,2*Math.PI);
 contexto.stroke(); 
 
 //The label:
 if(this.draw_label_type=="ht")
  {
   x=this.pos_x+(chip_width/2)-(contexto.measureText(this.label).width/2);  
   contexto.fillText(this.label,x,this.pos_y-2); 
  }
  
 if(this.draw_label_type=="v")
  {
   for(x=0; x<this.label.length; x++)
    {	 
     contexto.fillText(this.label[x],this.pos_x+(chip_width/2)-(contexto.measureText("X").width/2),this.pos_y+18+(x*8)); 
    }
  }
 
 //los pins:
 for(x=1; x<=this.num_pins; x++) this.pin[x].draw(); 
 
 contexto.strokeStyle=c;
}

//Return the x position of the up-left corner position of the chip.
chip.prototype.get_pos_x=function()
{
 return this.pos_x;
}

//Return the y position of the up-left corner position of the chip.
chip.prototype.get_pos_y=function()
{
 return this.pos_y;
}

//Return an array with the 4 positions of the corners of the chip
//The array will have 4 values:
// [0]: Position x (top-left corner.)
// [1]: Position y (top-left corner.) 
// [2]: Position x (bottom-right corner.).
// [3]: Position y (bottom-right corner.). 
chip.prototype.get_squares_pos=function()
{
 var p=[];
 
 p[0]=this.pos_x;
 p[1]=this.pos_y;
 p[2]=this.xf;
 p[3]=this.yf;
 
 return p;
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//*********************************** CHIP **********************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//********************************** LINE **********************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function line()
{
 this.ground=false; // If ground  is true, will not taken into account the voltage.
 this.volt=0; //Voltage in the line at this moment. 
 this.pins=[]; //pins that are connected to the line.
}

line.prototype.add_pin=function(pin)
{
 var k=this.pins.length;
 this.pins[k]=pin; //Pointer of the line to the pin
 pin.line=this; //Pointer of the pin to the line.
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
     if(this.pins[x].type=="i" || this.pins[x].type=="io") this.pins[x].chip.engine();
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
     color='#000000';
     if(this.volt<0 && this.volt!=GROUND) color='#FFFF00';     
     if(this.volt==GROUND) color='#0000FF'; //if ground: blue.
     if(this.volt>0 && this.volt<=5) //if 0-5v: Red.
      {
       x=Math.floor(this.volt*255/5); 
       color='#'+x.toString(16).toUpperCase()+'0000';
      }

     contexto.beginPath();
     
     contexto.moveTo(this.pins[0].px+pin_width/2,this.pins[0].py+pin_high/2);
     for(x=1; x<np; x++)
      {
	   contexto.lineTo(this.pins[x].px+pin_width/2,this.pins[x].py+pin_high/2); 	
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
